
const axios = require('axios');
const dateFormat = require('dateformat');
const fs = require('fs');
const Path = require('path');
const Json2csvParser = require('json2csv').Parser;
const execSync = require('child_process').execSync;

const past = new Date('01 July 2018');
const now = new Date();

const start = `${dateFormat(past, "yyyymmdd", true)}T${dateFormat(past, "HH", true)}`;
const end = `${dateFormat(now, "yyyymmdd", true)}T${dateFormat(now, "HH", true)}`;

const auth = {
  username: process.argv[2],
  password: process.argv[3],
};

const url = 'https://amplitude.com/api/2/export';
const path = Path.resolve(__dirname, 'out');

const exportFields = [
  'server_received_time',
  'app',
  'device_carrier',
  '$schema',
  'city',
  'user_id',
  'uuid',
  'event_time',
  'platform',
  'os_version',
  'amplitude_id',
  'processed_time', 
  'user_creation_time',
  'version_name',
  'ip_address',
  'paying',
  'dma',
  'group_properties',
  'user_properties',
  'client_upload_time',
  '$insert_id',
  'event_type',
  'library',
  'amplitude_attribution_ids',
  'device_type',
  'device_manufacturer',
  'start_version',
  'location_lng',
  'server_upload_time',
  'event_id',
  'location_lat',
  'os_name',
  'amplitude_event_type',
  'device_brand',
  'groups',
  'event_properties',
  'data',
  'device_id',
  'language',
  'device_model',
  'country',
  'region',
  'is_attribution_event',
  'adid',
  'session_id',
  'device_family',
  'sample_rate',
  'idfa',
  'client_event_time',
];

const getFilesAndFolders = async (dir, keepDotFiles=false) => {
  
  return new Promise((resolve, reject) => {
    fs.readdir(dir, (err, items) => {
      if(err) {
        reject(err);
      }

      const newItems = [];

      if(keepDotFiles === true) {
        for(let a=0; a<items.length; a++) {
          newItems.push(items[a]);
        }
      } else {
        for(let a=0; a<items.length; a++) {
          if(!items[a].startsWith('.')) {
            newItems.push(items[a]);
          }
        }
      }

      resolve(newItems);
    });
  });
  
};

const clearDirs = async () => {

  execSync(`rm -rf ${path}/csv/*`);
  execSync(`rm -rf ${path}/gzip/*`);
  execSync(`rm -rf ${path}/json/*`);
  execSync(`rm -rf ${path}/zip/*`);
  execSync(`rm -rf ${path}/json-combined/*`);

};

const getExport = async () => {

  // axios image download with response type "stream"
  const response = await axios({
    method: 'GET',
    url: url,
    responseType: 'stream',
    params: {
      start,
      end,
    },
    auth,
  });

  // pipe the result stream into a file on disc
  response.data.pipe(fs.createWriteStream(`${path}/zip/data.zip`));

  // return a promise and resolve when download finishes
  return new Promise((resolve, reject) => {
    response.data.on('end', () => {
      resolve()
    })

    response.data.on('error', () => {
      reject(new error('Some problem!'));
    })
  });
  
};

const secondaryExtract = async () => {

  const folders = await getFilesAndFolders(`${path}/gzip/`);

  for(let a=0; a<folders.length; a++) {
    const files = await getFilesAndFolders(`${path}/gzip/${folders[a]}`);

    for(let b=0; b<files.length; b++) {
      execSync(`gunzip -c ${path}/gzip/${folders[a]}/${files[b]} > ${path}/json/${files[b]}.${a}.${b}.json`);
    }
  }

};

const JSONReader = async () => {

  //we assume that the JSON files are 1 object per line, no terminating comma on the line and empty line at the end of each file.
  const files = await getFilesAndFolders(`${path}/json/`);

  const arr = [];

  for(let a=0; a<files.length; a++) {
    const lines = fs.readFileSync(`${path}/json/${files[a]}`, 'utf8').split('\n').filter(Boolean);
    
    for(let b=0; b<lines.length; b++) {
      const obj = JSON.parse(lines[b]);
      arr.push(obj);
    }
  }

  const JSONstr = JSON.stringify(arr);
  fs.writeFileSync(`${path}/json-combined/out.json`, JSONstr);

  const json2csvParser = new Json2csvParser({ fields: exportFields });
  const csv = json2csvParser.parse(arr);
   
  fs.writeFileSync(`${path}/csv/out.csv`, csv);

};

const run = async() => {

  try {
    console.log(`Getting data from ${start} to ${end}`);
    console.log('');

    await clearDirs();

    //DOWNLOAD THE STUFF
    console.log('Starting Download');
    await getExport();
    console.log('Downloaded OK!');

    //DO INITIAL EXTRACT
    console.log('Starting Extract 1');
    execSync(`unzip -a ${path}/zip/data.zip -d ${path}/gzip`);
    console.log('Finished Extract 1');

    //DO SECONDARY EXTRACT
    console.log('Starting Extract 2');
    await secondaryExtract();
    console.log('Finished Extract 2');

    //JSON READER
    console.log('Starting JSON Parse');
    await JSONReader();
    console.log('Finishing JSON Parse');

  } catch(err) {
    console.log(err);
  }

}

run();

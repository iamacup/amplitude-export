# A tool that exports amplitude data or takes an existing amplitude export and combines all of the data into a single file (JSON) per date (day). It also creates a flattened CSV file with all event properties as columns for non technical usage in excel

## Setup:

`yarn install`

## Running:

There are two modes of running:

1. This program will download the amplitude data between two dates for you, you just need to modify a file slightly and provide your amplitude APK Key and Secret Key or;
2. Provide an export from Amplitude - this needs to come from the manage data console within Amplitude.

### 1. Downloading the export for you

Edit the index.js file and change the `past` and `now` variables to decide when you want the export to be performed from/to

```bash
node index.js download <API Key> <Secret Key>
```

### 2. Extracting an existing export

Place the zip file you recieved from the amplitude data export tool in `out/zip/` and name it `data.zip`

```bash
node index.js
```

### Running out of memory / JavaScript Heap

it is possible to run out of memory when executing on very large data sets - if this happens you will see a message about the heap. You can append `--max-old-space-size=8192` to your command like this:

```bash
node --max-old-space-size=8192 index.js
```

or

```bash
node --max-old-space-size=8192 index.js download <API Key> <Secret Key>
```

Which will set the heap to 8 GB, you can vary the 8192 value to whatever you need.
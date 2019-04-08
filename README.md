# A tool that exports amplitude data and saves it as a huge JSON object and CSV file, it will also flatten any custom event properties onto the data in the CSV / JSON

## Setup

    With `npm`:

        npm install

    or with `yarn`:

        yarn install

## Downloading the export for you

Edit the index.js file and change the past and now variables to decide when you want the export to be performed from/to

    node index.js download <aptitude username> <aptitude password>

## Extracting an existing export

Place the zip file you recieved from the amplitude data export tool in out/zip/ and name it data.zip

    node index.js

## Running out of memory / JavaScript Heap

it is possible to run out of memory when executing - if this happens you will see a message about the heap. You can append `--max-old-space-size=8192` to your command like this:

    node --max-old-space-size=8192 index.js

Which will set the heap to 8 GB, you can vary the 8192 value to whatever you need.
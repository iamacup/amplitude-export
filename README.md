# A tool that exports amplitude data and saves it as a huge JSON object and CSV file, it will also flatten any custom event properties onto the data in the CSV / JSON

## Setup

    With `npm`:

        npm install

    or with `yarn`:

        yarn install

## Downloading the export for you

Edit the index.js file and change the past and now variables to decide when you want the export to be performed from/to

With `npm`:

    npm start download <aptitude username> <aptitude password>

or with `yarn`:

    yarn start download <aptitude username> <aptitude password>

## Extracting an existing export

Place the zip file you recieved from the amplitude data export tool in out/zip/ and name it data.zip

With `npm`:

    npm start

or with `yarn`:

    yarn start


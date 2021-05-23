## Instructions

```
$ npm install
```

## Dependencies
- `dotenv`
- `aws-sdk`
- `multer`
- `multer-s3` 
- `uuid`
- `express`
- `cors`

This is a micro-service that you can start to post a file to in order to upload it to Digitalocean Object Storage. It will return the file name along with a success message if the upload was a success.

It also includes a mode for local storage of files in /uploads. The endpoint for this is `http://localhost:3001/upload-local` and accepts a single file field called `upload`.

## Configurations

You will have to set the environment variables for AWS in order for your application to authenticate properly - as such:

#### Linux/MacOS:

```
$ export AWS_ACCESS_KEY_ID=YOUR_DIGITAL_OCEAN_KEY_ID
$ export AWS_SECRET_ACCESS_KEY=YOUR_DIGITAL_OCEAN_KEY_SECRET
```

#### Windows CMD:
```
C:\> setx AWS_ACCESS_KEY_ID YOUR_DIGITAL_OCEAN_KEY_ID
C:\> setx AWS_SECRET_ACCESS_KEY YOUR_DIGITAL_OCEAN_KEY_SECRET
```
OR

#### Windows PowerShell
```
PS C:\> $Env:AWS_ACCESS_KEY_ID="YOUR_DIGITAL_OCEAN_KEY_ID"
PS C:\> $Env:AWS_SECRET_ACCESS_KEY="YOUR_DIGITAL_OCEAN_KEY_SECRET"
```

## How to send data

#### Curl
```
curl --location --request POST 'http://localhost:3001/upload' \
--form 'upload=@"/path/to/file/freeshipping.jpg"'
```

#### Javascript
```
var formdata = new FormData();
formdata.append("upload", fileInput.files[0], "/path/to/file/freeshipping.jpg");

var requestOptions = {
  method: 'POST',
  body: formdata,
  redirect: 'follow'
};

fetch("http://localhost:3001/upload", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));
```

#### NodeJS Axios
```
var axios = require('axios');
var FormData = require('form-data');
var fs = require('fs');
var data = new FormData();
data.append('upload', fs.createReadStream('/path/to/file/freeshipping.jpg'));

var config = {
  method: 'post',
  url: 'http://localhost:3001/upload',
  headers: { 
    ...data.getHeaders()
  },
  data : data
};

axios(config)
.then(function (response) {
  console.log(JSON.stringify(response.data));
})
.catch(function (error) {
  console.log(error);
});
```

#### PHP Curl
```
<?php

$curl = curl_init();

curl_setopt_array($curl, array(
  CURLOPT_URL => 'http://localhost:3001/upload',
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => '',
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 0,
  CURLOPT_FOLLOWLOCATION => true,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => 'POST',
  CURLOPT_POSTFIELDS => array('upload'=> new CURLFILE('/path/to/file/freeshipping.jpg')),
));

$response = curl_exec($curl);

curl_close($curl);
echo $response;

```

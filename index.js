require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const { v4: uuidv4 } = require('uuid');

app.use(cors({
	origin: 'http://localhost', // replace this with your relevant domain to restrict it to
	optionsSuccessStatus: 200
}));

const spacesEndpoint = new aws.Endpoint(process.env.DIGITALOCEAN_ENDPOINT);
const s3 = new aws.S3({
	endpoint: spacesEndpoint,
});

const upload = multer({
	storage: multerS3({
		s3: s3,
		bucket: process.env.DIGITALOCEAN_BUCKET_ID,
		acl: 'public-read',
		key: function (request, file, cb) {
			file.originalname = `${uuidv4()}.` + file.originalname;
			cb(null, file.originalname);
		},
	}),
}).array('input_name', 1); // replace `input_name` with your field name


app.post('/upload', (req,res, next) => {

	upload(req, res, (error) => {
		if(error){
			console.log(error);
			res.json({
				success: false,
				message: error
			})
			return;
		}

		res.json({
			success: true,
			name: req.files[0].originalname,
			message: 'Successfully uploaded file'
		})
	});
});

app.listen(3001,function() {
	console.log('Started server on port 3030');
});

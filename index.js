require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');

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
}).array('upload', 1); // replace `upload` with your field name and also adapt in your request (upload is the field in the examples provided

const storage = multer.diskStorage({
	destination: function(req, file, cb) {
		cb(null, 'uploads/');
	},

	// By default, multer removes file extensions so let's add them back
	filename: function(req, file, cb) {
		cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
	}
});

app.post('/upload-local', (req, res) => {
	let storeLocal = multer({
		storage: storage,
	}).single('upload');

	storeLocal(req, res, (err) => {
		if(err){
			return res.json({
				success: false
			});
		}

		res.json({
			success: true,
			file: req.file.path
		});
	});
});

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
	console.log('Started server on port 3001');
});

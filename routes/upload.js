const express = require('express');

const router = express.Router();

const multer = require('multer');

const fs = require('fs');

const {

PutObjectCommand

} = require("@aws-sdk/client-s3");

const s3 = require('../config/s3');

const upload = multer({

dest:'uploads/'

});

router.post(

'/',

upload.single('image'),

async(req,res)=>{

try{

const file=req.file;

const stream=fs.createReadStream(file.path);

await s3.send(

new PutObjectCommand({

Bucket:process.env.AWS_BUCKET,

Key:Date.now()+"-"+file.originalname,

Body:stream,

ContentType:file.mimetype

})

);

fs.unlinkSync(file.path);

res.send("Image Uploaded Successfully");

}catch(err){

console.log(err);

res.status(500).send(err);

}

});

module.exports=router;

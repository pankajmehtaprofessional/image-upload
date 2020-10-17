"use strict"

let router = require('express').Router()
let multer = require('multer')
let path   = require('path')
let ImageModel  = require('./ImageModel')
let {check, validationResult} = require('express-validator')

let storage = multer.diskStorage({
	destination: function (req, file, cb) {
	  cb(null, './public/img/')
	},
	filename: function (req, file, cb) {
		cb(null, Date.now() + path.extname(file.originalname))
    }
})
  
let upload = multer({ storage: storage,
    limits: {
        fileSize: 2*1024*1024
    } 
})

router.get('/',async (req, res)=>{
    let data = await ImageModel.find()
    res.render('index',{
        data: data
    });
})

router.post('/', upload.array('images',12), async (req, res) =>{
    req.files.map(async value => {
        await ImageModel.create({ path: value.filename })
    })
    res.redirect('/')
})

module.exports = router
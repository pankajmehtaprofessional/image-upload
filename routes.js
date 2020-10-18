"use strict"

let router      = require('express').Router()
let multer      = require('multer')
let path        = require('path')
let ImageModel  = require('./ImageModel')

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
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg" || file.mimetype == "image/gif") {
          cb(null, true);
        } else {
          cb(null, false);
          return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    } 
})

let uploadResponse = upload.array('images',12)

/**
 * Get uploaded images
 */
router.get('/',(req, res)=>{
    ImageModel.find().then(data => 
        res.render('index',{
            data: data
        })
    )
})

/**
 * Upload images
 */
router.post('/', (req, res) =>{
    uploadResponse(req, res ,(err)=>{
        if(err){
            console.log(`Multer error : ${err}`)
            req.flash('error', 'Multer error.')
            res.redirect('/')
        }
        else if(req.files.length < 4){
            req.flash('error', 'Please select atleast 4 files.')
            res.redirect('/')
        }
        else{
            ImageModel.deleteMany().then(() => {
                let response = req.files.map(value => {
                    return ImageModel.create({ path: value.filename })
                })
                Promise.all(response).then(() => res.redirect('/'))
            })
        }        
    })
})

/**
 * Get uploaded images ( API )
 */
router.get('/api',(req, res) => {
    ImageModel.find().select(['-__v','-createdAt','-updatedAt']).then(data => 
        res.status(200).json({
            success: true,
            message: "Details",
            data
        })
    )
})

/**
 * Uploaded images ( API )
 */
router.post('/api', (req, res) =>{
    uploadResponse(req, res ,(err)=>{
        if(err){
            res.status(502).json({
                success: false,
                message: "Multer error",
                data   : err
            })
        }else if(req.files.length < 4){
            res.status(502).json({
                success: false,
                message: "Please select atleast 4 files"
            })
        }
        else{            
            ImageModel.deleteMany().then(() => {
                let response = req.files.map(value => {
                    return ImageModel.create({ path: value.filename })
                })
                Promise.all(response).then(()=>{
                    ImageModel.find().select(['-__v','-createdAt','-updatedAt']).then((result) => {
                        res.status(200).json({
                            success: true,
                            message: "Added successfully",
                            data   : result
                        })
                    })
                    
                })
            })    
        }
    })
})

module.exports = router
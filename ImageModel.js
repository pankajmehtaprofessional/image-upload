"use strict"

const mongoose  = require('mongoose')
const Schema    = mongoose.Schema

let ImageSchema = new Schema({
    path            : {
        type    : String, 
        required: true,
        get     : (fullpath) =>{
            return `${APP_URL}img/${fullpath}`
        }
    }
},{ timestamps : true });


// Export the model
module.exports = mongoose.model('Image', ImageSchema);
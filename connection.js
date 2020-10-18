"use strict"

let mongoose = require('mongoose')
const dbName = "assignment"
const mongoURI = `mongodb://pankaj:pankaj@cluster0-shard-00-00-ja2aw.mongodb.net:27017,cluster0-shard-00-01-ja2aw.mongodb.net:27017,cluster0-shard-00-02-ja2aw.mongodb.net:27017/${dbName}?ssl=true&replicaSet=ClusterMasjeed1-shard-0&authSource=admin&retryWrites=true`

mongoose.set('useFindAndModify', false)

module.exports = () => {
    mongoose.connect(`${mongoURI}`, { 
        useNewUrlParser: true, useUnifiedTopology: true, dbName: dbName 
    })
    .then(response=> { console.log("Database connection successful"); return response})
    .catch(error => console.log("error : ",JSON.stringify(error)))
}
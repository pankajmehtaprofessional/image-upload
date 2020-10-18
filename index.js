"use strict"

let express         = require('express')
let app             = express()

app.use(flash())

const PORT = 4000

app.use(express.static('public'))
app.set('view engine','ejs')
require('./globals')

app.use('/', require('./routes'))
const mongoose = require('./connection')()

app.listen(PORT, () => console.log(`App listening on port ${PORT}`))
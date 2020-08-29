const express = require("express")
const session = require("express-session")
const bodyparser = require("body-parser")
const cookieparser = require("cookie-parser")
const e = require("express")
const hbs = ("hbs")

const app = express()

const urlencoder = bodyparser.urlencoded({
    extended:false
})

app.listen(3000, function(){
    console.log("now listening to port 3000")
})
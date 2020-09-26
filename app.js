const express = require("express")
const bodyparser = require("body-parser")
const hbs = require("hbs")
const mongoose = require("mongoose")
const session = require("express-session")

const app = express()

mongoose.Promise = global.Promise
mongoose.connect("mongodb+srv://admin:p@ssword@cluster0.jd2cr.mongodb.net/Literarea?retryWrites=true&w=majority", {
  useNewUrlParser:true
})

app.set("view engine", "hbs")
app.use(express.static(__dirname + "/public"))

app.use(session({
  secret : "secret",
  name : "secretname",
  resave: true,
  saveUninitialized :true
}))

app.use(require("./controllers"))

app.listen(process.env.PORT || 3000)
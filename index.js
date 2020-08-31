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

app.use(session({
    secret: "very secret",
    resave: false,
    saveUninitialized: true,
    cookie:{
        maxAge:1000*60*60
    }
}))

app.use(express.static(__dirname + '/public'));

app.get("/", (req,res)=>{
    if(req.session.username){
        res.render("index.hbs",{
            username:req.session.username
        })
    }
    else{
        res.render("index.hbs")
    }
})

app.get("/register", (req,res)=>{
    res.render("register.hbs")
})

app.get("/login", (req,res)=>{
    res.render("login.hbs")
})


app.listen(3000, function(){
    console.log("now listening to port 3000")
})
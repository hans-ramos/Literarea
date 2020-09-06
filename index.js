const express = require("express")
const session = require("express-session")
const bodyparser = require("body-parser")
const cookieparser = require("cookie-parser")
const e = require("express")
const { handlebars } = require("hbs")
const hbs = ("hbs")
const mongoose = require("mongoose")
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
        res.render("index.hbs",{
        })
    }
})

app.get("/register", (req,res)=>{
    if(!req.session.username)
    {
        res.render("register.hbs")
    }
    else{
        res.redirect("/")
    }
})

app.get("/login", (req,res)=>{
    if(!req.session.username)
    {
        res.render("login.hbs")
    }
    else{
        res.redirect("/")
    }
})

app.post("/login_form",urlencoder, (req,res)=>{
    if(req.body.username=="admin"&&req.body.password=="1234"){
        req.session.username = "admin"
        res.redirect("/")
    }
    else{
        res.render("login.hbs",{
            error:"Incorrect username or password"
        })
    }
})

app.get("/userprofile", (req,res)=>{
    if(!req.session.username){
        res.redirect("/login")
    }
    else{
        res.render("userprofile.hbs",{
            username:req.session.username
        })
    }
})

app.get("/view_prompts",(req,res)=>{
    if(req.session.username){
        res.render("view_prompts.hbs",{
            username:req.session.username
        })
    }
    else{
        res.render("view_prompts.hbs")
    }
})

app.get("/view_stories",(req,res)=>{
    if (req.session.username){
        res.render("view_stories.hbs",{
            username:req.session.username
        })
    }
    else{
        res.render("view_stories.hbs")
    }
})

app.get("/subscriptions", (req,res)=>{
    if(!req.session.username){
        res.redirect("/login")
    }
    else{
        res.render("subscriptions.hbs",{
            username:req.session.username
        })
    }
})

app.get("/collection", (req,res)=>{
    if(!req.session.username){
        res.redirect("/login")
    }
    else{
        res.render("collection.hbs",{
            username:req.session.username
        })
    }
})

app.get("/get_profile",(req,res)=>{
    if (req.session.username){
        res.render("getprofile.hbs",{
            username:req.session.username
        })
    }
    else{
        res.render("getprofile.hbs")
    }
})

app.get("/post_story", (req,res)=>{
    if(!req.session.username){
        res.redirect("/login")
    }
    else{
        res.render("post_story.hbs",{
            username:req.session.username
        })
    }
})

app.get("/post_prompt", (req,res)=>{
    if(!req.session.username){
        res.redirect("/login")
    }
    else{
        res.render("post_prompt.hbs",{
            username:req.session.username
        })
    }
})

app.get("/edit_story", (req,res)=>{
    if(!req.session.username){
        res.redirect("/login")
    }
    else{
        res.render("edit_story.hbs",{
            username:req.session.username
        })
    }
})

app.get("/edit_prompt", (req,res)=>{
    if(!req.session.username){
        res.redirect("/login")
    }
    else{
        res.render("edit_prompt.hbs",{
            username:req.session.username
        })
    }
})

app.get("/read_story",(req,res)=>{
    if (req.session.username){
        res.render("read_story.hbs",{
            username:req.session.username
        })
    }
    else{
        res.render("read_story.hbs")
    }
})

app.get("/read_prompt",(req,res)=>{
    if (req.session.username){
        res.render("read_prompt.hbs",{
            username:req.session.username
        })
    }
    else{
        res.render("read_prompt.hbs")
    }
})

app.get("/signout",(req,res)=>{
    req.session.destroy()
    res.redirect("/")
})

app.listen(3000, function(){
    console.log("now listening to port 3000")
})
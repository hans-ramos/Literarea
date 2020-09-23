const express = require("express")
const session = require("express-session")
const bodyparser = require("body-parser")
const cookieparser = require("cookie-parser")
const e = require("express")
const { handlebars } = require("hbs")
const hbs = ("hbs")
const mongoose = require("mongoose")
var CryptoJS = require("crypto-js");
const router= express.Router()
const app = express()
const {User} = require("../models/user")
const {Story} = require("../models/story")
const {Prompt} = require("../models/prompt")

const urlencoder = bodyparser.urlencoded({
    extended:false
})

router.use(urlencoder);

router.get("/register", (req,res)=>{
    if(!req.session.username)
    {
        res.render("register.hbs")
    }
    else{
        res.redirect("/")
    }
})

router.post("/register_form",urlencoder,(req,res)=>{
    let email = req.body.email
    let username = req.body.username
    let password = req.body.password
    if(email.trim()== ""||username.trim() == ""||password.trim()==""){
        res.render("register.hbs", {
            error: "One or more fields are empty. Please enter valid values"
        })
    // }else if (!isEmailAvailable(email)){
    //     res.render("register.hbs",{
    //         error:"Email address has already been used"
    //     })
    // }else if (!isUsernameAvailable(username)){
    //     res.render("register.hbs",{
    //         error:"Username has already been taken"
    //     })
    }else{
        let encryptPw = CryptoJS.MD5(password).toString()
        let user = new User({
            email:email,
            username:username,
            password:encryptPw
        })
        user.save().then((doc)=>{
            req.session.username=username;
            res.redirect("/")
        })
    }    
})

function isEmailAvailable(email){
    User.findOne({email:email}).then(user =>{
        if(!user){
            console.log("Student is: " + JSON.stringify(user));
            return true
        }
        else{
            console.log("Student is: " + JSON.stringify(user));
            return false
        }
    })
}

function isUsernameAvailable(username){
    User.findOne({username:username},function(err, result){
        if (err){
            console.log("Error: "+ err)
        }
        else if(result){
            console.log("Student is: " + JSON.stringify(result));
            return false
        }else{
            return true
        }
    })
}

router.get("/login", (req,res)=>{
    if(!req.session.username)
    {
        res.render("login.hbs")
    }
    else{
        res.redirect("/")
    }
})

router.post("/login_form",urlencoder, (req,res)=>{
    username=req.body.username;
    password=req.body.password;
    let encryptPw = CryptoJS.MD5(password).toString()
    User.findOne({username:username, password:encryptPw}).then(doc =>{
        if(doc){
            req.session.username = username
            res.redirect("/") 
        }
        else{
            res.render("login.hbs",{
                error:"Incorrect username or password"
            })
        }
    })
})


router.get("/userprofile", (req,res)=>{
    if(!req.session.username){
        res.redirect("/login")
    }
    else{
        var stories = Story.find({author:req.session.username})
        var prompts = Prompt.find({author:req.session.username})
        User.findOne({username:req.session.username}).then((doc)=>{
            res.render("userprofile.hbs",{
                username:req.session.username,
                stories:stories,
                prompts:prompts,
                my_profile:doc
            })
        })
    }
})

router.get("/subscriptions", (req,res)=>{
    if(!req.session.username){
        res.redirect("/login")
    }
    else{
        res.render("subscriptions.hbs",{
            username:req.session.username
        })
    }
})

router.get("/get_profile",(req,res)=>{
    if (req.session.username){
        res.render("getprofile.hbs",{
            username:req.session.username
        })
    }
    else{
        res.render("getprofile.hbs")
    }
})


router.get("/edit_profile", (req,res)=>{
    if(!req.session.username){
        res.redirect("/login")
    }
    else{
        User.findOne({username:req.session.username}).then((doc)=>{
        res.render("edit_profile.hbs",{
            username:req.session.username,
            profile:doc
        })
    })
    }
})

router.post("/edit_profile_form",urlencoder,(req,res)=>{
    let bio = req.body.bio
    let intro = req.body.intro
    User.findOneAndUpdate({username:req.session.username},
    {
        bio:bio,
        intro:intro
    }).then((doc)=>{
        res.redirect("/user/userprofile");
    })
})

router.get("/signout",(req,res)=>{
    req.session.destroy()
    res.redirect("/")
})

module.exports = router
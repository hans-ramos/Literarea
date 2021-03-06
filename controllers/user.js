const express = require("express")
const session = require("express-session")
const bodyparser = require("body-parser")
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
    }else{
        User.findOne({email:email},function(err, result){
            if(err){
                console.log("Error" + err)
            }
            else if(result){
                res.render("register.hbs",{
                    error:"Email has already been used"
                })
            }
            else{
                User.findOne({username:username},function(err, result){
                    if(err){
                        console.log("Error"+err)
                    }
                    else if (result){
                        res.render("register.hbs",{
                            error:"Username has already been taken"
                        })
                    }
                    else{
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
            }
        })
    }  
})

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

router.get("/about_us",(req,res)=>{
    if (req.session.username){
        res.render("about_us.hbs",{
                username:req.session.username

            })
    }
    else{
        res.render("about_us.hbs")
        }
    }
)

router.get("/userprofile", (req,res)=>{
    if(!req.session.username){
        res.redirect("/login")
    }
    else{
            Story.find({author:req.session.username}).then((stories)=>{
                Prompt.find({author:req.session.username}).then((prompts)=>{
                    User.findOne({username:req.session.username}).then((user)=>{
                    res.render("userprofile.hbs",{
                        username:req.session.username,
                        stories:stories,
                        prompts:prompts,
                        my_profile:user
                    })
                })
            })
        })
    }
})

router.get("/subscriptions", (req,res)=>{
    if(!req.session.username){
        res.redirect("/login")
    }
    else{
        User.findOne({username:req.session.username}).then((user)=>{
            Story.find({author:user.subscriptions}).then((stories)=>{
                Prompt.find({author:user.subscriptions}).then((prompts)=>{
                    res.render("subscriptions.hbs",{
                        username:req.session.username,
                        user:user,
                        stories:stories,
                        prompts:prompts
                    })
                })
            })
        })
    }
})

router.get("/get_profile/:id", (req,res)=>{
    if (req.session.username){
        User.findOne({username:req.params.id}).then((user)=>{
            Story.find({author:req.params.id}).then((stories)=>{
                Prompt.find({author:req.params.id}).then((prompts)=>{
                    User.findOne({username:req.session.username, subscriptions:req.params.id},function(err, result){
                        if(err){
                            console.log("Error" + err)
                        }
                        else if (result){
                            res.render("getprofile.hbs",{
                                username:req.session.username,
                                stories:stories,
                                prompts:prompts,
                                user_profile:user,
                                subscribed:true
                            })
                        }
                        else{
                            res.render("getprofile.hbs",{
                                username:req.session.username,
                                stories:stories,
                                prompts:prompts,
                                user_profile:user,
                            })
                        }
                    })
                })
            })
        })
    }
    else{
        User.findOne({username:req.params.id}).then((user)=>{
            Story.find({author:req.params.id}).then((stories)=>{
                Prompt.find({author:req.params.id}).then((prompts)=>{
                    res.render("getprofile.hbs",{
                        stories:stories,
                        prompts:prompts,
                        user_profile:user
                    })
                })
            })
        })
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

router.post("/get_profile/follow_author",urlencoder,(req,res)=>{
    let author = req.body.author
    User.findOneAndUpdate({username:req.session.username},
        {
            $push:{
                subscriptions:author
            }
        }).then((doc)=>{
            res.redirect("/user/get_profile/" + author)
        })
})

router.post("/get_profile/unfollow_author",urlencoder,(req,res)=>{
    let author = req.body.author
    User.findOneAndUpdate({username:req.session.username},
        {
            $pull:{
                subscriptions:author
            }
        }).then((doc)=>{
            res.redirect("/user/get_profile/" + author)
        })
})

router.post("/search",urlencoder,(req,res)=>{
    let search = req.body.search
    if (req.session.username){
        User.find({username:search}).then((users)=>{
            Prompt.find({prompt:search}).then((prompts)=>{
                Story.find({title:search}).then((stories)=>{
                    res.render("search_result.hbs",{
                        username:req.session.username,
                        users,
                        prompts,
                        stories
                    })
                })
            })
        })
    }
    else{
        User.find({username:search}).then((users)=>{
            Prompt.find({prompt:search}).then((prompts)=>{
                Story.find({title:search}).then((stories)=>{
                    res.render("search_result.hbs",{
                        users,
                        prompts,
                        stories
                    })
                })
            })
        })
    }
})


router.get("/signout",(req,res)=>{
    req.session.destroy()
    res.redirect("/")
})

module.exports = router

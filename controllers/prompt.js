const express = require("express")
const session = require("express-session")
const bodyparser = require("body-parser")
const cookieparser = require("cookie-parser")
const e = require("express")
const { handlebars } = require("hbs")
const hbs = ("hbs")
const mongoose = require("mongoose")
const router= express.Router()
const app = express()
const {User} = require("../models/user")
const {Prompt} = require("../models/prompt")

const urlencoder = bodyparser.urlencoded({
    extended:false
})

router.use(urlencoder);

router.get("/view_prompts",(req,res)=>{
    if (req.session.username){
        Prompt.find({}).then((docs)=>{
            res.render("view_prompts.hbs",{
                username:req.session.username,
                prompts: docs
            })
        })
    }
    else{
        Prompt.find({}).then((docs)=>{
            res.render("view_prompts.hbs",{
                username:req.session.username,
                prompts: docs
            })
        })
    }
})

router.get("/post_prompt", (req,res)=>{
    if(!req.session.username){
        res.redirect("/user/login")
    }
    else{
        res.render("post_prompt.hbs",{
            username:req.session.username
        })
    }
})

router.post("/post_prompt_form",urlencoder,(req,res)=>{
    let prompt_title = req.body.prompt
    let genre = req.body.prompt_genre
    let prompt = new Prompt({
        prompt: prompt_title,
        date_posted: new Date(),
        author: req.session.username,
        genre: genre,
        likes: 0
    })
    prompt.save().then((doc)=>{
        res.redirect("/prompt/view_prompts")
    })
})

router.get("/edit_prompt", (req,res)=>{
    if(!req.session.username){
        res.redirect("/user/login")
    }
    else{
        res.render("edit_prompt.hbs",{
            username:req.session.username
        })
    }
})


router.get("/read_prompt/:id",(req,res)=>{
    if (req.session.username){
        Prompt.findOne({_id:req.params.id}).then((doc)=>{
            res.render("read_prompt.hbs",{
                username:req.session.username,
                prompt:doc
        })
        
        })
    }
    else{
        Prompt.findOne({_id:req.params.id}).then((doc)=>{
            res.render("read_prompt.hbs",{
                prompt:doc
            })
        })
    }
})
module.exports = router
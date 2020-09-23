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
const {Story} = require("../models/story")

const urlencoder = bodyparser.urlencoded({
    extended:false
})

router.use(urlencoder);

router.get("/view_stories",(req,res)=>{
    if (req.session.username){
        Story.find({}).then((docs)=>{
            res.render("view_stories.hbs",{
                username:req.session.username,
                stories: docs
            })
        })
    }
    else{
        Story.find({}).then((docs)=>{
            res.render("view_stories.hbs",{
                username:req.session.username,
                stories: docs
            })
        })
    }
})

router.get("/post_story", (req,res)=>{
    if(!req.session.username){
        res.redirect("/user/login")
    }
    else{
        res.render("post_story.hbs",{
            username:req.session.username
        })
    }
})

router.post("/post_story_form",urlencoder,(req,res)=>{
    let title = req.body.title
    let genre = req.body.story_genre
    let body = req.body.story_body
    console.log(req.body.story_body)
    let story = new Story({
        title: title,
        date_posted: new Date(),
        author: req.session.username,
        genre: genre,
        body: body,
        likes: 0
    })
    story.save().then((doc)=>{
        res.redirect("/story/view_stories")
    })
})

router.get("/edit_story", (req,res)=>{
    if(!req.session.username){
        res.redirect("/user/login")
    }
    else{
        res.render("edit_story.hbs",{
            username:req.session.username
        })
    }
})

router.get("/read_story/:id",(req,res)=>{
    if (req.session.username){
        Story.findOne({_id:req.params.id}).then((doc)=>{
            res.render("read_story.hbs",{
                username:req.session.username,
                story:doc
        })
        
        })
    }
    else{
        Story.findOne({_id:req.params.id}).then((doc)=>{
            res.render("read_story.hbs",{
                story:doc
            })
        })
    }
})
module.exports = router
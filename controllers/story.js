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

router.get("/edit_story/:id", (req,res)=>{
    if(!req.session.username){
        res.redirect("/user/login")
    }
    else{
        Story.findOne({_id:req.params.id}).then((doc)=>{
            res.render("edit_story.hbs",{
                username:req.session.username,
                story:doc
            })
        })
    }
})

router.post("/edit_story/edit_story_form",urlencoder, (req,res)=>{
    let id = req.body.id
    let title= req.body.title
    let genre = req.body.story_genre
    let body = req.body.story_body
    Story.findOneAndUpdate({_id:id},
        {
            title:title,
            genre:genre,
            body:body
        }).then((doc)=>{
            res.redirect("/user/userprofile")
        })
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

router.post("/delete_story", urlencoder,(req,res)=>{
    let id = req.body.id
    Story.deleteOne({
        _id:id
    }).then((doc)=>{
        if(doc.n){
            res.send(true)
        }else{
            res.send(false)
        }
    }, (err)=>{
        res.send(false)
    })
})

router.post("/read_story/post_story_comment",urlencoder,(req,res)=>{
    let id =req.body.id
    let comment = req.body.comment
    Story.findOneAndUpdate({_id:id},
        {
            $push: {
                comments:{
                    comment:comment,
                    commenter:req.session.username
                }
            }
        }).then((doc)=>{
            res.redirect("/story/read_story/" + id)
        })
})

module.exports = router
const express = require("express")
const session = require("express-session")
const bodyparser = require("body-parser")
const e = require("express")
const { handlebars } = require("hbs")
const hbs = ("hbs")
const mongoose = require("mongoose")
const router= express.Router()
const app = express()
const {User} = require("../models/user")
const {Story} = require("../models/story")

var set_genre = "All"
var set_sort = "Recent"

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

router.get("/read_story/:id", (req,res)=>{
    if(req.session.username){
        Story.findOne({_id:req.params.id}).then((story)=>{
            User.findOne({username:req.session.username, liked_content:req.params.id},function(err, result){
                if(err){
                    console.log("Error" +err)
                }
                else if (result){
                    res.render("read_story.hbs",{
                        story:story,
                        username:req.session.username,
                        liked:true
                    })
                }
                else{
                    res.render("read_story.hbs",{
                        story:story,
                        username:req.session.username
                    })
                }
            })
        })
    }
    else{
        Story.findOne({_id:req.params.id}).then((story)=>{
            res.render("read_story.hbs",{
                story:story
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

router.post("/read_story/delete_story_comment", urlencoder,(req,res)=>{
    let story_id = req.body.story_id
    let comment_id = req.body.comment_id
    Story.findOneAndUpdate({_id:story_id},
        {
            $pull: {
                comments:{_id:comment_id}
            }
        }).then((doc)=>{
            if(doc){
                res.send(true)
                
            }else{
                res.send(false)
            }
        }, (err)=>{
            res.send(false)
            console.log("error")
        })
})

router.post("/read_story/like_story",urlencoder,(req,res)=>{
    let id = req.body.story_id
    User.findOneAndUpdate({username:req.session.username},
        {
            $push:{
                liked_content:id
            }
        }).then((user)=>{
            Story.findOneAndUpdate({_id:id},
                {
                    $inc:{
                        likes:1
                    }
                }).then((story)=>{
                    res.redirect("/story/read_story/" + id)
                })
        })
})

router.post("/read_story/unlike_story",urlencoder,(req,res)=>{
    let id = req.body.story_id
    User.findOneAndUpdate({username:req.session.username},
        {
            $pull:{
                liked_content:id
            }
        }).then((user)=>{
            Story.findOneAndUpdate({_id:id},
                {
                    $inc:{
                        likes:-1
                    }
                }).then((story)=>{
                    res.redirect("/story/read_story/" + id)
                })
        })
})


router.get("/sort-by-recent",(req,res,)=>{
    set_sort = "Recent"
    sort(req, res)
})

router.get("/sort-by-liked",(req,res,)=>{
    set_sort = "Most-Liked"
    sort(req, res)
})

router.get("/sort-by-all",(req,res,)=>{
    set_genre = "All"
    sort(req, res)
})

router.get("/sort-by-adventure",(req,res,)=>{
    set_genre = "Adventure"
    sort(req, res)
})

router.get("/sort-by-horror",(req,res,)=>{
    set_genre = "Horror"
    sort(req, res)
})

router.get("/sort-by-mystery",(req,res,)=>{
    set_genre = "Mystery"
    sort(req, res)
})

function sort (req,res){
    if (req.session.username){
        if (set_genre != "All"){
            if (set_sort == "Most-Liked"){
                Story.find({genre: set_genre}).sort({likes: -1}).then((docs)=>{
                    res.render("view_stories.hbs",{
                        username:req.session.username,
                        stories: docs
                    })
                })
            }
            else{
                Story.find({genre: set_genre}).sort({date_posted: -1}).then((docs)=>{
                    res.render("view_stories.hbs",{
                        username:req.session.username,
                        stories: docs
                    })
                })
            }
        }
        else{
            if (set_sort == "Most-Liked"){
                Story.find({}).sort({likes: -1}).then((docs)=>{
                    res.render("view_stories.hbs",{
                        username:req.session.username,
                        stories: docs
                    })
                })
            }
            else{
                Story.find({}).sort({date_posted: -1}).then((docs)=>{
                    res.render("view_stories.hbs",{
                        username:req.session.username,
                        stories: docs
                    })
                })
            }      
        }
    }
    else{
        if (set_genre != "All"){
            if (set_sort == "Most-Liked"){
                Story.find({genre: set_genre}).sort({likes: -1}).then((docs)=>{
                    res.render("view_stories.hbs",{
                        username:req.session.username,
                        stories: docs
                    })
                })
            }
            else{
                Story.find({genre: set_genre}).sort({date_posted: -1}).then((docs)=>{
                    res.render("view_stories.hbs",{
                        username:req.session.username,
                        stories: docs
                    })
                })
            }
        }
        else{
            if (set_sort == "Most-Liked"){
                Story.find({}).sort({likes: -1}).then((docs)=>{
                    res.render("view_stories.hbs",{
                        username:req.session.username,
                        stories: docs
                    })
                })
            }
            else{
                Story.find({}).sort({date_posted: -1}).then((docs)=>{
                    res.render("view_stories.hbs",{
                        username:req.session.username,
                        stories: docs
                    })
                })
            }      
        }
    }
}

module.exports = router
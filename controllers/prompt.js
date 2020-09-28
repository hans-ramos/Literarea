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
const {Prompt} = require("../models/prompt")

var set_genre = "All"
var set_sort = "Recent"

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

router.get("/edit_prompt/:id", (req,res)=>{
    if(!req.session.username){
        res.redirect("/user/login")
    }
    else{
        Prompt.findOne({_id:req.params.id}).then((doc)=>{
            res.render("edit_prompt.hbs",{
                username:req.session.username,
                prompt:doc
            })
        })
    }
})

router.post("/edit_prompt/edit_prompt_form", urlencoder,(req,res)=>{
    let id=req.body.id
    let prompt=req.body.prompt
    let genre=req.body.prompt_genre
    Prompt.findOneAndUpdate({_id:id},
        {
            prompt:prompt,
            genre:genre
        }).then((doc)=>{
            res.redirect("/user/userprofile")
        })
})


router.get("/read_prompt/:id", (req,res)=>{
    if(req.session.username){
        Prompt.findOne({_id:req.params.id}).then((prompt)=>{
            User.findOne({username:req.session.username, liked_content:req.params.id},function(err, result){
                if(err){
                    console.log("Error" +err)
                }
                else if (result){
                    res.render("read_prompt.hbs",{
                        prompt:prompt,
                        username:req.session.username,
                        liked:true
                    })
                }
                else{
                    res.render("read_prompt.hbs",{
                        prompt:prompt,
                        username:req.session.username
                    })
                }
            })
        })
    }
    else{
        Prompt.findOne({_id:req.params.id}).then((prompt)=>{
            res.render("read_prompt.hbs",{
                prompt:prompt
            })
        })
    }
})

router.post("/delete_prompt", urlencoder,(req,res)=>{
    let id = req.body.id
    Prompt.deleteOne({
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

router.post("/read_prompt/post_prompt_comment",urlencoder,(req,res)=>{
    let id =req.body.id
    let comment = req.body.comment
    Prompt.findOneAndUpdate({_id:id},
        {
            $push: {
                comments:{
                    comment:comment,
                    commenter:req.session.username
                }
            }
        }).then((doc)=>{
            res.redirect("/prompt/read_prompt/" + id)
        })
})

router.post("/read_prompt/delete_prompt_comment", urlencoder,(req,res)=>{
    let prompt_id = req.body.prompt_id
    let comment_id = req.body.comment_id
    Prompt.findOneAndUpdate({_id:prompt_id},
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

router.post("/read_prompt/like_prompt",urlencoder,(req,res)=>{
    let id = req.body.prompt_id
    User.findOneAndUpdate({username:req.session.username},
        {
            $push:{
                liked_content:id
            }
        }).then((user)=>{
            Prompt.findOneAndUpdate({_id:id},
                {
                    $inc:{
                        likes:1
                    }
                }).then((prompt)=>{
                    res.redirect("/prompt/read_prompt/" + id)
                })
        })
})

router.post("/read_prompt/unlike_prompt",urlencoder,(req,res)=>{
    let id = req.body.prompt_id
    User.findOneAndUpdate({username:req.session.username},
        {
            $pull:{
                liked_content:id
            }
        }).then((user)=>{
            Prompt.findOneAndUpdate({_id:id},
                {
                    $inc:{
                        likes:-1
                    }
                }).then((prompt)=>{
                    res.redirect("/prompt/read_prompt/" + id)
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
                Prompt.find({genre: set_genre}).sort({likes: -1}).then((docs)=>{
                    res.render("view_prompts.hbs",{
                        username:req.session.username,
                        stories: docs
                    })
                })
            }
            else{
                Prompt.find({genre: set_genre}).sort({date_posted: -1}).then((docs)=>{
                    res.render("view_prompts.hbs",{
                        username:req.session.username,
                        stories: docs
                    })
                })
            }
        }
        else{
            if (set_sort == "Most-Liked"){
                Prompt.find({}).sort({likes: -1}).then((docs)=>{
                    res.render("view_prompts.hbs",{
                        username:req.session.username,
                        stories: docs
                    })
                })
            }
            else{
                Prompt.find({}).sort({date_posted: -1}).then((docs)=>{
                    res.render("view_prompts.hbs",{
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
                Prompt.find({genre: set_genre}).sort({likes: -1}).then((docs)=>{
                    res.render("view_prompts.hbs",{
                        username:req.session.username,
                        stories: docs
                    })
                })
            }
            else{
                Prompt.find({genre: set_genre}).sort({date_posted: -1}).then((docs)=>{
                    res.render("view_prompts.hbs",{
                        username:req.session.username,
                        stories: docs
                    })
                })
            }
        }
        else{
            if (set_sort == "Most-Liked"){
                Prompt.find({}).sort({likes: -1}).then((docs)=>{
                    res.render("view_prompts.hbs",{
                        username:req.session.username,
                        stories: docs
                    })
                })
            }
            else{
                Prompt.find({}).sort({date_posted: -1}).then((docs)=>{
                    res.render("view_prompts.hbs",{
                        username:req.session.username,
                        stories: docs
                    })
                })
            }      
        }
    }
}

module.exports = router
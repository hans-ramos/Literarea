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

module.exports = router
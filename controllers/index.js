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
const User = require("../models/user")
const Story = require("../models/story")
const Prompt = require("../models/prompt")

const urlencoder = bodyparser.urlencoded({
    extended:false
})


router.use("/user", require("./user"))
router.use("/story", require("./story"))
router.use("/prompt", require("./prompt"))

router.get("/", (req,res)=>{
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

module.exports = router
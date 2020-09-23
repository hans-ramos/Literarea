const mongoose = require("mongoose")

let Prompt = mongoose.model("prompt",{
        prompt:String,
        date_posted:Date,
        author:String,
        genre:String,
        likes:Number,
        comments:[String]
    })
module.exports={
    Prompt
}
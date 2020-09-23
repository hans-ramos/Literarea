const mongoose = require("mongoose")

let Story =mongoose.model("story",{
        title:String,
        date_posted:Date,
        author:String,
        genre:String,
        body:String,
        likes:Number,
        comments:[String]
})

module.exports = {
    Story
}
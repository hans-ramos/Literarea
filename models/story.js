const mongoose = require("mongoose")

// let Comment = mongoose.model("comment",{
//     content:String,
//     commenter:String
// })

let Story =mongoose.model("story",{
        title:String,
        date_posted:Date,
        author:String,
        genre:String,
        body:String,
        likes:Number,
        comments:[{
           comment:String,
           commenter:String
        }]
})

module.exports = {
    Story
}
const mongoose = require("mongoose")
let User = mongoose.model("user",{
        username: String,
        password: String,
        email: String,
        intro: String,
        bio: String,
        subscriptions: [String],
        liked_content:[String]
})
module.exports={
        User
    }
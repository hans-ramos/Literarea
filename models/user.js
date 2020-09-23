const mongoose = require("mongoose")
let User = mongoose.model("user",{
        username: String,
        password: String,
        email: String,
        intro: String,
        bio: String,
        stories: Array,
        prompts: Array,
        comments: Array,
        subscriptions: [Array]
})
module.exports={
        User
    }
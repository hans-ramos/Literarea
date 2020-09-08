prompts:[
    {
        _id: ObjectID(),
        prompt:String,
        date_posted:Date,
        author:String,
        genre:String,
        likes:Number,
        views:Number,
        comments:Array
    },{
        _id: 456,
        prompt: "You now own an island",
        date_posted: "2020-09-01T20:30:15.100Z",
        author:"Tom Nook",
        genre:"Adventure",
        likes: 4000,
        views: 5000,
        comments:[
            {
                _id: ObjectID(),
                comment: String,
                commenter: String,
            },{
                _id: 654,
                comment: "I will turn it into an island resort",
                commenter: "Juan Dela Cruz"
            }
        ]
    }
]

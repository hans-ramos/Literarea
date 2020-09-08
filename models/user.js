users: [
    {
        _id:ObjectID(),
        username: String,
        password: String,
        email: String,
        intro: String,
        bio: String,
        stories: Array,
        prompts: Array,
        comments: Array,
        reviews: Array,
        subscriptions: Array
    },{
        _id:321,
        username: "Juan Dela Cruz",
        password: "secret",
        email:"generic@gmail.com",
        intro:"Hi there!",
        bio:"I am a 21 year old Filipino.",
        stories:[
            {
                _id: ObjectID(),
                title:String
            },{
                _id: 123,
                title: "Hello World",
            }
        ],
        comments:[
            {
                _id: ObjectID(),
                comment: String
            },{
                _id: 654,
                comment: "I will turn it into an island resort"
            }
        ]
    },{
        _id:432,
        username: "Tom Nook",
        password: "ACNH",
        email:"ACNH@gmail.com",
        intro:"Hello there!",
        bio:"I am a tanuki.",
        prompts:[
            {
                _id: ObjectID(),
                prompt:String
            },{
                _id:456,
                prompt: "You now own an island"
            }
        ],
        comments:[
            {
                _id: ObjectID(),
                comment: String
            },{
                _id: 234,
                comment: "I CRIED AT THE ENDING"
            }
        ],
        subscriptions:[
            {
                _id: ObjectID(),
                author:String
            },{
                _id:321,
                author:"Juan Dela Cruz"
            }
        ]
    }
]
stories:[
    {
        _id: ObjectID(),
        title:String,
        date_posted:Date,
        author:String,
        genre:String,
        body:String,
        likes:Number,
        views:Number,
        comments:Array,
        reviews:Array
    },{
        _id: 123,
        title: "Hello World",
        date_posted: "2020-09-01T20:30:15.100Z",
        author:"Juan Dela Cruz",
        genre:"Mystery",
        body:"Lorem ipsum dolor sit, amet consectetur adipisicing elit",
        likes: 4000,
        views: 5000,
        comments:[
            {
                _id: ObjectID(),
                comment: String,
                commenter: String,
            },{
                _id: 234,
                comment: "I CRIED AT THE ENDING",
                commenter: "Tom Nook"
            }
        ],
        reviews:[
            {
                __id: ObjectID(),
                recommend:String,
                review:String,
                reviewer:String
            },{
                _id: 2340,
                recommend:"Recommended",
                review:"Very nice story",
                reviewer:"Tom Nook"
            }
        ]
    }
]

const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    picture: String,
    user: { // userid
        type: mongoose.Schema.Types.ObjectId,
        ref: "user" // is the name of the userSchema in users.js(as userid is basically the username)
    },
    caption: String,
    date: {
        type: Date,
        default: Date.now
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user" // as other users will be liking the posts
        }
    ],
},  { timestamps: true }
);

module.exports = mongoose.model("post", postSchema);
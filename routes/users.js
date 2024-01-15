const mongoose = require('mongoose');
const plm = require('passport-local-mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/instagram" , {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = mongoose.Schema({
  username: String,
  name: String,
  email: String,
  password: String,
  profileImage: String,
  bio: String,
  posts: [{  
    type: mongoose.Schema.Types.ObjectId, // for any posts/story/image's id is saved in the database 
    ref: "post"
  }],
});

userSchema.plugin(plm); // we have provided serialize/deserialized users in app.js so with this we provide them in the userSchema

module.exports = mongoose.model("user", userSchema);
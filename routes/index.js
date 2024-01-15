var express = require('express');
const mongoose = require('module');
const router = express.Router();
const userModel = require("./users");
const passport = require('passport');
const localStrategy = require("passport-local"); // allowing user to make account on the basis of password and username so if anyone login next time can login on the basis of password/username
const upload = require('./multer');
const postModel = require("./post");

passport.use(new localStrategy(userModel.authenticate())); // keeping user logged in

router.get('/', function(req, res) {
  res.render('index', {footer: false});
});

router.get('/login', function(req, res) {
  res.render('login', {footer: false});
});

router.get('/feed', isLoggedIn, async function(req, res) {
  const user = await userModel.findOne({ username: req.session.passport.user})
  const posts = await postModel.find().populate("user"); // find(will only find the userid) but we also need the data(basically who posted, what etc(user)) so populate(WORKS ON WHO HAS OBJECTID)
  res.render('feed', {footer: true, posts, user});
});

router.get('/profile', isLoggedIn, async function(req, res) {
  const user = await userModel.findOne({ username: req.session.passport.user}).populate("posts"); // finding the user, populate gets all the posts
  res.render('profile', {footer: true, user}); // sending on the page so can be used to show on profile
});

router.get('/search', isLoggedIn, function(req, res) {
  res.render('search', {footer: true});
});

router.get('/edit', isLoggedIn, async function(req, res) {
  const user = await userModel.findOne({username: req.session.passport.user}); // to show the changes made on screen while diting
  res.render('edit', {footer: true, user});
});

router.get('/upload', isLoggedIn, async function(req, res) {
  res.render('upload', {footer: true});
});

// req sent by search bar is get over here
router.get('/username/:username', isLoggedIn, async function(req, res) {
  const regex = new RegExp(`^${req.params.username}`, 'i'); // we use regex to find all the users with that particular names
  const users = await userModel.find({username: regex}); // we find user from database with particular username
  res.json(users); // we send res/data in json format to the frontend
});

// to like the post
router.get("/like/post/:id", isLoggedIn, async function(req, res) {
  const user = await userModel.findOne({username: req.session.passport.user}); // to get the user who has liked
  const post = await postModel.findOne({_id: req.params.id}); // to get the post that has been liked

  // if a person has already liked then remove and vice-versa
  if (post.likes.indexOf(user._id) === -1) { // -1 means user is not added(not liked)
    post.likes.push(user._id); // so when liked give the user id in the likes[](post database)
  } else {
    // we have to remove 1 user, particular so we use splice which takes(index, how many to remove)
    post.likes.splice(post.likes.indexOf(user._id), 1); // gives user index and how many(1) to remove from that index
  }

  await post.save();
  res.redirect("/feed");
});


// to create/register new user
router.post("/register", function(req, res, next) {
  const userData = new userModel({
    username: req.body.username, // username comes from the name given in the form(index.ejs(basically while creating the account))
    name: req.body.name,
    email: req.body.email
  });

  userModel.register(userData, req.body.password) // register creates the account with userdata and password, it returns a promise which is handled by .then funtion
  .then(function() {
    passport.authenticate("local") (req, res, function() {
      res.redirect("/profile");
    })
  })
});

// to login into exsisting account
router.post("/login", passport.authenticate("local", { // passport.authenticate : this means login in on the basis of password and username
  successRedirect: "/profile",
  failureRedirect: "/login"
}), function(req, res) {
});

// to logout 
router.get("/logout", function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

// to update profile : //  with the username(it will be matched with the data saved on the server)
router.post("/update", upload.single('image'), async function(req, res) {
  const user = await userModel.findOneAndUpdate( // to find the user from the database(findoneAndUpdate is a mongodb function), we provide unique value, then data(updated one) and new is true to chenge it
    {username: req.session.passport.user}, // found the user
    {username: req.body.username, name: req.body.name, bio: req.body.bio}, // updated information of that username
    {new: true}
  );

  if(req.file) { // as if we dont upload an image it should not give an error
    user.profileImage = req.file.filename; // updating profile image(req.file.filename : we get from upload.single)
    await user.save(); // saving the changes
    res.redirect("/profile");
  }
  
});

// to upload/create new post
router.post("/upload", isLoggedIn, upload.single('image'), async function(req, res) {
  const user = await userModel.findOne({ username: req.session.passport.user }); // find the user

  const post = await postModel.create({ // creating a new post
    picture: req.file.filename,  
    user: user._id,            // ._id comes from user(username), date and likes will be default
    caption: req.body.caption,
  })

  user.posts.push(post._id);
  await user.save();
  res.redirect("/feed");

});

// check if isLoggedIn for protected routes
function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()) return next(); // if already logged in then show the next(particular page)
  res.redirect("/login"); // if not then redirect to login page so that he/she can login
};

module.exports = router;

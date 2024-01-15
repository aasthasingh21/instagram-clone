login & register page
feed page
profile page
picture
story feature
edit details
share to story
search accounts

1 : frontend with ejs and tailwind css
2 : node modules for backend : npm install
3 : dependencies : npm install passport passport-local passport-local-mongoose mongoose express-session multer uuid
4 : passport code and session and serialize/deserialize user code in the app.js
5 : connect mongodb with the help of mongoose and create/export userSchema(collection)
6 : to make all the routes (login,register,feed,profile etc.) in the index.js
7 : to edit the profile 
    1 : when tapped on edit image an input file is opened which allow to upload file(default hidden)
    2 : so we give ids to button(edit image) and input form(file(to upload the image))
    3 : we write script code with eventListeners 
    4 : after editing details the form has to sent to update route(create update route)
    5 : we have to upload the image and edit details so we make use of multer
    6 : create a new route(multer.js) and setup multer(npm multer)
    7 : make new route /update in app.js to update the information (is initiated when update profile is hit on the
        edit page)
    8 : update page finds the user from database findone/update function by username and update user information
    9 : the updated information has to be shown on the profile so again we find the user on the profile route and
        show accordngly (<%= %>)
8 : update post and post and all as well 
    1 : to show posts in the upload.ejs and (/upload route) and write script code to select the image using
        queryselector...
    2 : to showcase posts we make another route (route.js), as posts itself will be an array of data(already
        mentioned in users.js) with several elements/feature(caption,image etc.), so we make another schema
    3 : make a route(upload.post) to upload the posts in the index.js
    4 : find and show these user information on feed route as well and show them on feed page(feed.ejs)
    5 : show your posts on the profile : populate("posts) in profile route to get all the posts and show them in
        the profile.ejs by loop(forEach)
9 : search bar : we make use of axios (cdn/install), 
    we take input from user and addeventlisters to it, by axios we send this req to backend, backend we make a username route(index.js), where we use regex to get the req.params.username and which is used by user(const) to find that particular username from the database and is send in json format to the fronten(search.ejs), where it is received by looping(as to show all users with that letter/var), which is thendisplayed on the web page 
10 : like and delete posts
    1 : on the feed.ejs

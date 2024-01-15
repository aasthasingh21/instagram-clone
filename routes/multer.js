const multer = require('multer');
const {v4: uuidv4} = require('uuid'); // uuidv4 gives us am unique name
const path = require('path'); // has all the extensions

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/images/uploads')); // is the address where we save the iamge
    },

    filename: function (req, file, cb) {
        const unique = uuidv4(); // we use uuidv4 for naming every file uniquiely
        cb(null, unique + path.extname(file.originalname)) // is the unique name of the file
    },
});
  
const upload = multer({ storage: storage }); // upload variable helps upload files

module.exports = upload;


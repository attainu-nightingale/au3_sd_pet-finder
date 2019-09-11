var multer = require("multer");
var path = require('path');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '/tmp');
    },
    filename: function (req, file, cb) {
        //current date
        var datetimestamp = Date.now();

        //file.fieldname is the name specific in the form  .originalname name of file in users computer
        cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1]);
    }
});

var upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        var ext = path.extname(file.originalname);
        if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg' && ext != '.bmp') {
            return cb(new Error('Only images are allowed'))
        }
        cb(null, true)

    },
    //setting limit of images upload size
    limits: {
        fileSize: 1024 * 1024 * 2 //maximum size of image is 2mb
    }
})


module.exports=upload;
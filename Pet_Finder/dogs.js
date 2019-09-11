var express = require("express");
var router = express.Router();



router.get("/", function (req, res) {
    var db = req.app.locals.db;
    db.collection('petsinfo').find({ "breeds": req.query.breed }).toArray(function (error, result) {
        if (error) throw error;
        pets = result;
        res.render('dogs.hbs', {
            title: 'Dogs',
            pets: pets,
            style: 'dogs.css',
            script: 'dogs.js',
            loggedin: req.session.loggedIn,
            user: req.session.username,
        })
    })
});

module.exports=router;

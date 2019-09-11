var express = require("express");
var router = express.Router();
router.get('/', async function (req, res) {

    var db = req.app.locals.db;
    var petsData;
    var user = await db.collection('userinfo').findOne({ username: req.session.username });
    if (user) {
        db.collection('petsinfo').find({ $and:[{_id: { $nin: user.petAdded }},{adopted:false}]}).toArray(function (error, result) {
            if (error) throw error
            petsData = result
            res.render('home.hbs', {
                title: 'Home',
                pets: result,
                style: '/home.css',
                loggedin: req.session.loggedIn,
                user: req.session.username
            })
        })
    } else {

        db.collection('petsinfo').find({adopted:false}).toArray(function (error, result) {
            if (error) throw error
            petsData = result
            res.render('home.hbs', {
                title: 'Home',
                pets: result,
                style: '/home.css',
                loggedin: req.session.loggedIn,
                user: req.session.username
            });
        });
        }
})
module.exports = router;
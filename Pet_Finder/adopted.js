var express = require("express");
var router = express.Router();
console.log("adopted");
router.get("/", function (req, res) {
    var db = req.app.locals.db
    db.collection('petsinfo').find({ "adopted": true }).toArray(function (error, result) {
        if (error) throw error;
        pets = result
        res.render('adopted', {
            title: 'Success Stories',
            style: 'adopted.css',
            pets: pets,
            user:req.session.username,
            loggedin:req.session.loggedIn
        });
    })
});
module.exports = router;
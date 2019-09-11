var express=require("express");
var router=express.Router();

router.get("/",function(req,res){
    var db = req.app.locals.db;
    db.collection('petsinfo').find({ "breeds": req.query.breed }).toArray(function(error, result) {
        if (error) throw error;
        pets = result;
        res.render('cats.hbs', {
            title: 'Cats',
            pets: pets,
            style: 'cats.css',
            script: 'cats.js',
           loggedin:req.session.loggedIn,
           user: req.session.username,
        })
    })

});
module.exports=router;
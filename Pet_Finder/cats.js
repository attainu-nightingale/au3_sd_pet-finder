var express=require("express");
var router=express.Router();

router.get("/",function(req,res){
    var db = req.app.locals.db;
    db.collection('pets').find({ "breed": req.query.breed }).toArray(function(error, result) {
        if (error) throw error;
        pets = result;
        res.render('cats.hbs', {
            title: 'Cats Breed Search',
            pets: pets,
            style: 'cats.css',
            script: 'cats.js'
        })
    })

});


module.exports=router;
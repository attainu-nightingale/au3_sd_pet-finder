var express=require("express");
var router=express.Router();



router.get("/",function(req,res){
        var db = req.app.locals.db;
        db.collection('pets').find({ "breed": req.query.breed }).toArray(function(error, result) {
            if (error) throw error;
            pets = result;
            res.render('dogs.hbs', {
                title: 'Dog Breed Search',
                pets: pets,
                style: 'dogs.css',
                script: 'dogs.js'
            })
        })

});




module.exports=router;
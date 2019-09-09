var express=require("express");
var router=express.Router();

router.get('/', function(req,res){
    var db = req.app.locals.db;
    var petsData;
    db.collection('petsInfo').find({}).toArray(function(error, result){
        if(error) throw error
        petsData=result
        res.render('home.hbs', {
            title: 'Home',
            pets : petsData,
            style: '/home.css'
        })
    })
})

module.exports=router;
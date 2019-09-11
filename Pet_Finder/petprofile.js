<<<<<<< HEAD
var express=require("express");
var router=express.Router();
 
router.get("/:id",function(req,res){
    var db=req.app.locals.db ;
    db.collection("petsinfo").find({_id:require("mongodb").ObjectId(req.params.id)}).toArray(function(err,result){
        if (err) throw err;
        console.log(result[0],"sdffasds")
    res.render("petprofile",{
        petprofile:result[0],
        title:result[0].name,
        loggedin:req.session.loggedIn

    });
});
});
=======
var express=require("express");
var router=express.Router();
 
router.get("/:id",function(req,res){
    var db=req.app.locals.db ;
    db.collection("petsinfo").find({_id:require("mongodb").ObjectId(req.params.id)}).toArray(function(err,result){
        if (err) throw err;
        console.log(result[0],"sdffasds")
    res.render("petprofile",{
        petprofile:result[0],
        title:result[0].name,
        loggedin:req.session.loggedIn,
        user:req.session.username
});
});
});
>>>>>>> 8f565edf4a55bcbfa4eb3c8f0f2f6e502c5f08f5
module.exports=router
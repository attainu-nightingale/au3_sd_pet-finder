var express=require("express");
var router=express.Router();

router.get("/",function(req,res){
    res.send("user profile page");
          
});
module.exports=router;
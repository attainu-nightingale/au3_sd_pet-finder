var express=require("express");
var router=express.Router();

router.get("/",function(req,res){
    res.render("login",{
        layout: false,
        title: 'Login'
    });
});

router.post('/', function(req,res){
    var db=req.app.locals.db;
    var md5 = req.app.locals.md5;

    db.collection('userInfo').find({}).toArray(function(error,result){
        if(error) throw error;
        
        for(var i=0; i<result.length; i++){
         if(req.body.username === result[i].username && md5(req.body.password) === result[i].password){
           req.session.loggedIn = true
         }
        }
        if(req.session.loggedIn == true)
               res.redirect('/');
        else
           res.redirect('/login')      
    })
})

router.get('/logout', function(req,res){
    req.session.destroy();
    res.redirect('/login')
})


module.exports=router; 
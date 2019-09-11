var express=require("express");
var router=express.Router();
router.use(express.urlencoded({extended:true}));
router.get("/",function(req,res){
    res.render("login",{
        layout: false,
        title: 'Login'

    });
});
router.post('/', function(req,res){
    var db=req.app.locals.db;
    var md5 = req.app.locals.md5;
    db.collection('userinfo').find({}).toArray(function(error,result){
        if(error) throw error;      
        for(var i=0; i<result.length; i++){
         if(req.body.username === result[i].username && md5(req.body.password) === result[i].password){
           req.session.loggedIn = true;
           req.session.username=req.body.username;
         }
        }
        if(req.session.loggedIn == true)
               res.redirect('/');
        else
        res.render("login",{
            layout: false,
            title: 'Login',
            msg: 'Wrong username or password'
        });
    })
})
router.get('/logout', function(req,res){
    req.session.destroy();
    res.redirect('/login')
})
module.exports=router; 
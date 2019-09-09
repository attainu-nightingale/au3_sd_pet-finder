
var express=require("express");
var mongoClient=require('mongodb').MongoClient;
var assert=require("assert");
var app=express();
var session=require('express-session');

app.use(session({
    secret:"PetFinder",
    resave:false,
    saveUninitialized:true

}))
require('dotenv').config();


var url = process.env.MONGO_URL;
//assigning the db for global access
mongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function (error, client) {
    assert.equal(null, error);
    db = client.db('Petfinder');
    app.locals.db=db;
  //  console.log("connected ", db);
});



//default route //
app.set("view engine","hbs");
app.use(express.static("public"));
app.get('/',(req,res)=>{
    res.render("request");
});
app.get('/addpet',(req,res)=>{
    res.render("addpet");
});
app.use("/",require("./home"));
// //signUp route this route will inclued signup form  which will create new user account//
 app.use("/signup",require("./signup"));
// //login route will check login credentials of user and will redirect them to userProfile route//
app.use("/login",require("./login"));
// //userProfile route will display all the user info. here user can add,delete and update pet info//
 app.use("/userprofile",require("./userProfile"));
// //pets route will display all the pets available in db regardless of category(i.both cats and dogs )//
 app.use("/pets",require("./pets.js"));
// //seperate route only for dogs //
 app.use("/dogs",require("./dogs"));
// //seperate route only for cats //
 app.use("/cats",require("./cats"));
app.listen(8000,function(){
    console.log("port no:",8000);
});

var bodyParser = require('body-parser');
var hbs = require('hbs');
var md5 = require('md5');



app.locals.md5 = md5;

app.use(bodyParser.urlencoded())
app.use(express.static('public'));
app.set('view engine', 'hbs');

hbs.registerHelper('isActive', function(parameter, string, options){
    if(parameter == string){
        return options.fn(this)
    }
    else
      return options.inverse(this)
} )





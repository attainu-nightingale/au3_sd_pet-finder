var assert=require('assert');
var express = require('express');
var session = require('express-session')
var mongoClient = require('mongodb').MongoClient;
var bodyParser = require('body-parser');
var hbs = require('hbs');
var md5 = require('md5');
var app=express();
app.use(session({
    secret: 'This is expess-session secret',
    resave:false,
    saveUninitialized:true
}));
require('dotenv').config();
var url = process.env.MONGO_URL;
//assigning the db for global access
mongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function (error, client) {
 assert.equal(null, error);
    db = client.db('Petfinder');
    app.locals.db=db;
    if(db)
   console.log("connected ");
   else
   console.log("connection failed");
});
//default route //
app.set("view engine","hbs");
app.use(express.static("public"));
app.locals.md5 = md5;
hbs.registerHelper('isActive', function(parameter, string, options){
    if(parameter == string){
        return options.fn(this)
    }
    else
      return options.inverse(this)
} )
//default route //
app.use("/",require('./home'));
//signUp route this route will inclued signup form  which will create new user account//
app.use("/signup",require('./signup'));
//login route will check login credentials of user and will redirect them to userProfile route//
app.use("/login",require('./login'));
// userProfile route will display all the user info. here user can add,delete and update pet info//
 app.use("/userprofile",require("./userProfile.js"));
// //pets route will display all the pets available in db regardless of category(i.both cats and dogs )//
 app.use("/pets",require("./pets"));
// //seperate route only for dogs //
 app.use("/dogs",require("./dogs"));
// //seperate route only for cats //
 app.use("/cats",require("./cats"));
 //seprate routes for all dogs 
 app.use("/alldogs",require("./alldogs"));
 //seprate routes for all cats 
 app.use("/allcats",require("./allcats"));
 //individual pets info
 app.use("/petprofile",require("./petprofile"));
 //pet adopt root....
 app.use("/adopt",require('./adopt'));
 //success stories adopted routes..
 app.use("/adopted",require('./adopted'));

 
app.listen(8080);


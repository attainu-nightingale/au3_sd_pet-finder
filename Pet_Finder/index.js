
var express = require('express');
var session = require('express-session')
var mongoClient = require('mongodb').MongoClient;
var bodyParser = require('body-parser');
var hbs = require('hbs');
var md5 = require('md5');

var app=express();

app.use(session({
    secret: 'This is expess-session secret'
}));

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
var url = "mongodb+srv://sravya:sravya97@shallowdiveproject-vspow.mongodb.net/?retryWrites=true&w=majority";
var db;
mongoClient.connect(url, {useNewUrlParser: true} ,function(error,client){
    if(error)
        throw error;
    app.locals.db = client.db('PetFinder');
 })


//default route //
app.use("/",require('./home'));

//signUp route this route will inclued signup form  which will create new user account//
app.use("/signup",require('./signup'));

//login route will check login credentials of user and will redirect them to userProfile route//
app.use("/login",require('./login'));

// userProfile route will display all the user info. here user can add,delete and update pet info//
app.use("/userprofile",require("./userprofile"));
//pets route will display all the pets available in db regardless of category(i.both cats and dogs )//
app.use("/pets",require("./pets"));
//seperate route only for dogs //
app.use("/dogs",require("./dogs"));
//seperate route only for cats //
app.use("/cats",require("./cats"));

app.listen(8080);


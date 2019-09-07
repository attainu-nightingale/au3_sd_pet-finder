var express=require("express");
var app=express();
var mongoClient=require('mongodb').MongoClient
var hbs = require('hbs')

var url = 'mongodb+srv://abhay:abhay123@au3-projects-cluster-lcsfk.mongodb.net/?retryWrites=true&w=majority'

mongoClient.connect(url, { useNewUrlParser: true }, function (error, client) {
    if(error) throw error;
    app.locals.db = client.db('petFinder');
})

hbs.registerHelper('isActive', function(parameter, string, options){
    if(parameter == string){
        return options.fn(this)
    }
    else
      return options.inverse(this)
} )


app.set('view engine', 'hbs');
app.use(express.static('public'));
app.use(express.urlencoded());

//default route //
app.use("/",require("./home"));
//signUp route this route will inclued signup form  which will create new user account//
app.use("/signup",require("./signup"));
//login route will check login credentials of user and will redirect them to userProfile route//
app.use("/login",require("./login"));
//userProfile route will display all the user info. here user can add,delete and update pet info//
app.use("/userprofile",require("./userprofile"));
//pets route will display all the pets available in db regardless of category(i.both cats and dogs )//
app.use("/pets",require("./pets"));
//seperate route only for dogs //
app.use("/dogs",require("./dogs"));
//seperate route only for cats //
app.use("/cats",require("./cats"));
app.listen(3000);
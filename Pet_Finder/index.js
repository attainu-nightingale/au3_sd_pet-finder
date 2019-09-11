var express=require("express");
var session=require("express-session");
var app=express();

app.set("view engine",'hbs');
app.use(express.static('public'));
  var mongoClient=require("mongodb").MongoClient;
  var db;
  var url="mongodb+srv://saurabh:saurabh123@pf-1-wirmn.mongodb.net/?retryWrites=true&w=majority";
  mongoClient.connect(url,{useNewUrlParser:true},function(err,Client){
      if (err) throw err;
      app.locals.db=Client.db("petfinder");
  });
  


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
// app.use("/dogs",require("./dogs"));
//display all dogs regardless of all breeds//
app.use("/alldogs",require("./alldogs"));
//seperate route only for cats //
app.use("/cats",require("./cats")); 
//display all cats regardless of all breeds//
app.use("/allcats",require("./allcats"));
app.use("/petprofile",require("./petprofile"));
app.listen(3000);
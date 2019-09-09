
var express = require("express");
var multer = require("multer");
var cloudinary = require('cloudinary');
var path = require('path');
var fs = require('fs');
var assert = require('assert');
require('dotenv').config();
require('./handlers/cloudinary');
var upload=require('./handlers/multer');
var ObjectId = require('mongodb').ObjectID;
var tinify = require('tinify');  //it is required for image compression 
var helper = require('sendgrid').mail; // it required for sending mail


tinify.key = process.env.TINIFY_KEY;
var router = express.Router();



//db setup 

router.use(express.urlencoded({ extended: true }));
router.use(express.json({ extended: true }));

var db;


//adding new petsinfo in the database 
router.post('/', upload.single('File'), async (req, res) => {
    db=req.app.locals.db;
    var destination = '/tmp/' + req.file.filename;

    var source = await tinify.fromFile(req.file.path);
    await source.toFile(destination);

    console.log("Filename : " + req.file.path);
    starter();
    function starter() {
        //checking file type
        fs.stat("/tmp/" + req.file.filename,async function (err, stats) {

            if (err) {
                console.log("error occcour");
                starter();
            } else {
                
                //wait for the result
                var result=await cloudinary.v2.uploader.upload(destination);
            
                    //sending response it have to be changed;
                    req.body.public_id = result.public_id;
                    req.body.url = result.secure_url;
                   db.collection('petsinfo').insertOne(req.body, (error, addedPetinfo) => {
                       assert.equal(null, error);
                        //adding newAdded petid into user collection inplace of sadabahmad req.session.username  
                        db.collection('userinfo').updateOne({username:"sadabahmad"},{$push:{petAdded:addedPetinfo.insertedId}},function(error){
                           assert.equal(null,error);
                        });
                        // inplace of sadabahmad req.session.username 
                        res.redirect('../userprofile/sadabahmad');
                   
                });
            }

        });

    }
});


//updating pets info using form ...

router.put('/update/:id',(req,res)=>{

    db=req.app.locals.db;

    console.log(req.body);
    console.log("id is ",req.params.id)

    db.collection('petsinfo').updateOne({_id:ObjectId(req.params.id)},{$set:{
        name:req.body.name,
        age:req.body.age,
        vaccinated:req.body.vaccinated,
        trained:req.body.trained,
        category:req.body.category,
        breeds:req.body.breeds,
        location:req.body.location,
        color:req.body.color,
        email:req.body.email,
        phone:req.body.phone,
        description:req.body.description        
    }},(error,result)=>{
       assert.equal(null,error);

       //need to change here;
       //sadabahmad=req.session.username
       res.json("sadabahmad");
    });


});





// when user click on adopt button this will call and send the mail to the user for notify that some one wants ///to adopt your pet with all pet information 
router.get("/adopt", function (req, res) {


    var fromEmail = new helper.Email('techcode@gmail.com');
    var toEmail = new helper.Email('sadabkhan14198@gmail.com'); //here we write req.session.email
    var subject = 'Sending with SendGrid is Fun';
    var content = new helper.Content('text/plain', 'and easy to do anywhere, even with Node.js');
    var mail = new helper.Mail(fromEmail, subject, toEmail, content);
     
    var sg = require('sendgrid')(process.env.SENDGRID_API_KEY);
    var request = sg.emptyRequest({
      method: 'POST',
      path: '/v3/mail/send',
      body: mail.toJSON()
    });
     
    sg.API(request, function (error, response) {
      if (error) {
        console.log('Error response received');
      }
      console.log(response.statusCode);
      console.log(response.body);
      console.log(response.headers);
    });    

    res.send("this is pets page");

});
module.exports = router;


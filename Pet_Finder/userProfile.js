var express = require("express");
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var cloudinary = require('cloudinary');
var router = express.Router();
var helper = require('sendgrid').mail; // it required for sending mail
var multer = require("multer");
var path = require('path');
var fs = require('fs');
require('dotenv').config();
require('./handlers/cloudinary');
var upload = require('./handlers/multer');
var tinify = require('tinify');  //it is required for image compression 
tinify.key = process.env.TINIFY_KEY;



var db;

router.use(express.json({ extended: true }));
router.use(express.urlencoded({ extended: true }));
router.use(express.static("public"));

router.use(function (req, res, next) {
    if (req.session.loggedIn) {
        next();
    }
    else {
        res.redirect("/login");
    }
});

//user information update route
router.put('/update/info', async (req, res) => {
if(req.session.loggedIn){
    db = req.app.locals.db;
    console.log(req.body);
    //this is for updating email of session if we use email in any where
    //req.session.email=req.body.email;
    db.collection('userinfo').updateOne({ username: req.session.username }, {
        $set: {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            phone: req.body.phone,
            email: req.body.email,
        }
    }, function (error, result) {
        assert.equal(null, error);
        res.json("information updated successfully");
    });
} else{
   
    res.json("login");    
  }
});
//user profie update route

router.post('/pic/update', upload.single('profile_url'), async (req, res) => {
    db = req.app.locals.db;
    var destination = '/tmp/' + req.file.filename;

    var source = await tinify.fromFile(req.file.path);
    await source.toFile(destination);

    console.log("Filename : " + req.file.path);
    starter();
    function starter() {
        //checking file type
        fs.stat("/tmp/" + req.file.filename, async function (err, stats) {

            if (err) {
                console.log("error occcour");
                starter();
            } else {

                //wait for the result
                var result = await cloudinary.v2.uploader.upload(destination);

                //removing profile pic from cloudinary;
                console.log("body is ", req.body.public_id);
                if (req.body.public_id)
                    cloudinary.v2.uploader.destroy(req.body.public_id, (error, resu) => {
                        assert.equal(null, error)
                        console.log("result", resu);
                    });

                //sending response it have to be changed;
                req.body.public_id = result.public_id;
                req.body.url = result.secure_url;
                //adding newAdded petid into user collection 
                //sadabahmad replace by the req.session.username
                db.collection('userinfo').updateOne({ username: req.session.username }, { $set: { profile_url: req.body.url, public_id: req.body.public_id } }, function (error) {
                    assert.equal(null, error);

                    //inplace of sadabahmad req.session.username
                    res.redirect(`/userprofile/${req.session.username}/`);

                });

            }

        });

    }
});



router.get('/:username', async (req, res, next) => {

    db = req.app.locals.db;
    //getting user information   
    try {
        if (req.params.username) {
            var result = await db.collection('userinfo').findOne({ username: req.params.username });
        }
    } catch (error) {
        throw error;
    }


    //getting all pets upload by the user
    try {
        if (result) {
            console.log(result.petAdded);
            var petAdded = await db.collection('petsinfo').find({ _id: { $in: result.petAdded } }).toArray();
            petAdded.forEach(element => {
                element.location = element.location.split(",")[0];
            });

        }
    }
    catch (error) {
        throw error;
    }

    //getting all pets liked by the user
    try {
        if (result) {

            var petLiked = await db.collection('petsinfo').find({ _id: { $in: result.petLiked } }).toArray();
            petLiked.forEach(element => {
                element.location = element.location.split(",")[0];
            });
        }
    }
    catch (error) {
        throw error;
    }

    if (result) {
        console.log(petAdded);
        res.render('user', {
            userprof: result,
            petAdded: petAdded,
            petLiked: petLiked,
            user: req.session.username,
            loggedin: req.session.loggedIn,
            title:"User Profile"
        });
    }
    else {
        res.json("login");
    }
});


//deleting perticular pets from uploads

router.delete('/pets/delete/:id/:public_id', (req, res) => {

    db = req.app.locals.db;

    //removing pet details(document) from petsinfo collections
    db.collection('petsinfo').deleteOne({ _id: ObjectId(req.params.id) }, (error) => {
        assert.equal(null, error);
    });

    //removing photo from cloud;
    cloudinary.v2.uploader.destroy(req.params.public_id, (error) => {
        assert.equal(null, error);
    });

    //updating the userinfo
    db.collection('userinfo').updateOne({ username: req.session.username }, {
        $pull: { petAdded: ObjectId(req.params.id) }, 
        $pull: { petLiked: ObjectId(req.params.id) }
    }, (error, result) => {
        assert.equal(null, error);
        // console.log("result is",result);

        //deleting that pet from request
        db.collection('adoptrequest').deleteMany({pet_id:req.params.id},function(error){
            assert.equal(null,error);
        });

            res.json(result);
    });

});

// routes for update pet info

router.get('/update/petinfo', (req, res) => {

    res.render("addpet", {
        title: "update",
        petinfo: req.query,
        update: "update",
        user: req.session.username,
        loggedin: req.session.loggedIn
    });
})


//updating individual pets pic 

router.post('/pets/pic/update/:id/:pub_id', upload.single('petpic_url'), async (req, res) => {
    db = req.app.locals.db;
    var destination = '/tmp/' + req.file.filename;

    var source = await tinify.fromFile(req.file.path);
    await source.toFile(destination);

    console.log("Filename : " + req.file.path);
    starter();
    function starter() {
        //checking file type
        fs.stat("/tmp/" + req.file.filename, async function (err, stats) {

            if (err) {
                console.log("error occcour");
                starter();
            } else {

                //wait for the result
                var result = await cloudinary.v2.uploader.upload(destination);

                //removing pet pic from cloudinary;
                cloudinary.v2.uploader.destroy(req.params.pub_id, (error, resu) => {
                    assert.equal(null, error)
                    console.log("result", resu);
                });


                req.body.public_id = result.public_id;
                req.body.url = result.secure_url;

                db.collection('adoptrequest').updateMany({ pet_id: req.params.id }, { $set: { url: req.body.url } });

                //updating the url and public_id
                db.collection('petsinfo').updateOne({ _id: ObjectId(req.params.id) }, { $set: { url: req.body.url, public_id: req.body.public_id } }, function (error) {
                    assert.equal(null, error);

                    //inplace of sadabahmad req.session.username
                    res.redirect(`/userprofile/${req.session.username}/`);
                });

            }

        });

    }
});



module.exports = router;

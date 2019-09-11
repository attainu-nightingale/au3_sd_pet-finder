//adopt request route
var express = require('express');
var router = express.Router();
var path = require('path');
var helper = require('sendgrid').mail; // it required for sending mail
var ObjectId = require('mongodb').ObjectID;
var assert = require('assert');

var db;
router.use(express.static(path.join(__dirname, 'public')));
router.use(express.json({ extended: true }));

router.use(function (req, res, next) {
    if (req.session.loggedIn) {
        next();
    }
    else {
        res.redirect("/login");
    }

});
router.post('/:pet_id', async function (req, res) {

    db = req.app.locals.db;


    var user = await db.collection('userinfo').findOne({ username: req.session.username });
    //console.log(user);
    db.collection('petsinfo').findOne({ _id: ObjectId(req.params.pet_id) }, function (error, petsDetails) {
        if (error) throw error;
        //in place of techcode@gmail.com current user info..
        //  console.log(petsDetails);
        var emailtext = `<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body>
<p>Hiii !!  Myself  <b>${user.firstname} ${user.lastname}</b> i want to adopt your pet please confirm my request for pet adoption
</p>
       <a href="https://localhost:8080/petprofile/${req.params.pet_id}">Here
       </a>
      <p> click on the link for more details about pet </p>
       </body>
       </html>'
       `
        var fromEmail = new helper.Email(user.email);

        //in place of sadabkhan14198@gmail.com requested user info.
        var toEmail = new helper.Email(petsDetails.email);
        var subject = `Request from ${user.firstname} ${user.lastname} for pet adoption`
        //in place of sadabkhan username of current 
        var content = new helper.Content('text/html', emailtext);

        var mail = new helper.Mail(fromEmail, subject, toEmail, content);
        console.log(toEmail);

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

        db.collection('userinfo').find({ $and: [{ username: req.session.username }, { requestedPet: { $elemMatch: { $eq: req.params.pet_id } } }] }).toArray(function (error, result) {

            if (error)
                throw error;

            if (!result.length) {
                var adoptRequest = {
                    pet_id: req.params.pet_id,  //require for deleting perticular request
                    name: petsDetails.name,
                    age: petsDetails.age,
                    breeds: petsDetails.breeds,
                    url: petsDetails.url,
                    owner_name: petsDetails.email,
                    adopter_fname: user.firstname,
                    adopter_lname: user.lastname,
                    adopter_uname: req.session.username,   //req.session.username
                    adopter_email: user.email,   //save in the pets
                    status: 0
                }
                db.collection('adoptrequest').insertOne(adoptRequest, (error, result) => {
                    assert.equal(null, error);
                    db.collection('petsinfo').updateOne({ _id: ObjectId(req.params.pet_id) }, { $push: { requestedUser: req.session.username } });
                    db.collection('userinfo').updateOne({ username: req.session.username }, { $push: { requestedPet: req.params.pet_id } });
                    res.json("request is sent");
                });
            }
            else {
                res.json("request is already sent");
            }
        });
    });
})


router.get('/request', async (req, res) => {

    db = req.app.locals.db;

    var email = await db.collection('userinfo').findOne({ username: req.session.username });
    db.collection('adoptrequest').find({ owner_name: email.email }).toArray(function (error, result) {
        assert.equal(null, error);

        res.render("request", {
            loggedin: req.session.loggedIn,
            user: req.session.username,
            title: 'Request',
            pets: result
        })

    });


});


//accepting request
router.post('/accept/:id', async (req, res) => {

    db = req.app.locals.db;
    console.log(req.params.id);


    //finding the pet informaion
    var pet_result = await db.collection('petsinfo').findOne({ _id: ObjectId(req.params.id) });
    //updating pet as addopted
    console.log(pet_result);
    db.collection('petsinfo').updateOne({ _id: ObjectId(req.params.id) }, { $set: { adopted: true } });
    var requestedUser = pet_result.requestedUser;

    //finding all the user who sent the request for that pet and sending email
    db.collection('userinfo').find({ username: { $in: requestedUser } }).toArray(function (error, result) {
        if (error) throw error;

        result.forEach(user => {

            if (user.username !== req.body.user) {

                var emailtext = `<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body>
<p>sorry pet <strong>${pet_result.name} having breeds ${pet_result.breeds}</strong> hasbeen adopted by someone else you can check it in success stories
</p>
       <a href="https://localhost:8080">Here
       </a>
      <p> click on the link for more details </p>
       </body>
       </html>'
       `
                var fromEmail = new helper.Email("noreply@petfinder.com");

                //in place of sadabkhan14198@gmail.com requested user info.
                var toEmail = new helper.Email(user.email);
                var subject = `Pet has been adopted by someone else`
                //in place of sadabkhan username of current 
                var content = new helper.Content('text/html', emailtext);

                var mail = new helper.Mail(fromEmail, subject, toEmail, content);
                console.log(toEmail);

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

            }

            else {

                var emailtext = `<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body>
                <p>Congratulations pet <strong>${pet_result.name} having breeds ${pet_result.breeds}</strong> hasbeen adopted by you check the success stories.
                </p>
                       <a href="https://localhost:8080">Here
                       </a>
                      <p> click on the link for more details </p>
                       </body>
                       </html>'
                       `
                var fromEmail = new helper.Email("noreply@petfinder.com");

                //in place of sadabkhan14198@gmail.com requested user info.
                var toEmail = new helper.Email(user.email);
                var subject = `Request for pet adoption is accepted`
                //in place of sadabkhan username of current 
                var content = new helper.Content('text/html', emailtext);

                var mail = new helper.Mail(fromEmail, subject, toEmail, content);
                console.log(toEmail);

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
            }

        });


    });


    db.collection('adoptrequest').deleteMany({ pet_id: req.params.id }, function (error, result) {
        if (error) throw error;
        res.json("Thanks for helping us....");
    });

});


//deleting the adoption request..

router.delete('/delete/:id/:user/:email', async (req, res) => {

    db = req.app.locals.db;


    db.collection('adoptrequest').deleteOne({ $and: [{ adopter_uname: req.params.user }, { pet_id: req.params.id }] },
        (error, result) => {
            assert.equal(null, error);

            var emailtext = `<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body>
            <p>sorry request for pet  has been deleted by the pet owner
            </p>

                   </body>
                   </html>'
                   `
            var fromEmail = new helper.Email("noreply@petfinder.com");

            //in place of sadabkhan14198@gmail.com requested user info.
            var toEmail = new helper.Email(req.params.email);
            var subject = `Request for pet adoption has been deleted by pet-owner`
            //in place of sadabkhan username of current 
            var content = new helper.Content('text/html', emailtext);

            var mail = new helper.Mail(fromEmail, subject, toEmail, content);
            console.log(toEmail);

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
            res.json("request is deleted successfully");

        });


})

module.exports = router;
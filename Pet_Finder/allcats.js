var express = require("express");
var router = express.Router();
var ObjectId = require("mongodb").ObjectId;

router.get('/', function (req, res) {
  var db = req.app.locals.db;
  db.collection("petsinfo").find({ category: "cat" }).sort({_id:-1}).toArray(function (err, result) {
    if (err) throw err;
    result.forEach(element => {
      element.location=element.location.split(",")[0]; 
    });
    res.render("pets", {
      pets: result,
      title: "cats",
      style: "cards.css",
      script: "catlikes.js",
      loggedin:req.session.loggedIn,
      user: req.session.username,
    });

  });
});

router.use(function (req, res, next) {
  if (req.session.loggedIn) {
    next();
  }
  else {
    res.json("login");
  }
});
  router.post('/like/:id/', async (req, res) => {

    if (req.session.loggedIn){ 
    var db = req.app.locals.db;
    console.log(req.params.id);

    var result = await db.collection("usersinfo").findOne({ $and: [{ username: req.session.username }, { petLiked: { $elemMatch: { $eq: ObjectId(req.params.id) } } }] });
    if (!result) {
      db.collection("petsinfo").updateOne({ _id: ObjectId(req.params.id) }, { $inc: { likes_count: 1 } }, function (err, result) {
        if (err) throw err;
        //console.log(result);
        db.collection('usersinfo').updateOne({ username: req.session.username }, { $push: { petLiked: ObjectId(req.params.id) } }, function (error, result) {
          res.json({ likes: 1 });
        });


      });
    }
    else {

      db.collection("petsinfo").updateOne({ _id: ObjectId(req.params.id) }, { $inc: { likes_count: -1 } }, function (err, result) {
        if (err) throw err;
        //console.log(result);
        db.collection('usersinfo').updateOne({ username: req.session.username }, { $pull: { petLiked: ObjectId(req.params.id) } }, function (error, result) {
          res.json({ likes: -1 });
        });
      });

    }
  }
  else {
    res.json("login");
  }

  });


  module.exports = router;

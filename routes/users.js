const express = require('express');
const router = express.Router();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/user_info', { useNewUrlParser: true });

const Users = mongoose.model('Users', new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  age: Number,
  famille: String,
  race: String,
  nourriture: String,
  friends: [String]
}));

var authMiddle = require('./authMiddle');
/* GET users listing. */
router.get('/', authMiddle, function (req, res, next) {
  Users.find({}, function (err, data) {
    if (err) throw err;
    res.json(data);
  });
});

router.post('/_login', function (req, res) {
  console.log(req.body.name);
  Users.findOne({ name: req.body.name }, function (err, data) {
    console.log(data);
    if (err) {
      res.json(400, err);
    }
    if (data != null && data.password == req.body.password) {
      res.json({ status: "success" });
    } else {
      res.json({ status: "failed" });
    }
  });
});

router.get('/:name', authMiddle, function (req, res, next) {
  Users.findOne({ name: req.params.name }, function (err, data) {
    if (err) throw err;
    res.json(data);
  });
});

//router.get('/:name/friends', function (req, res) {
//  Users.findOne({ name: req.params.name }, function (err, doc) {
//    if (err) throw err;
//    friends = doc.friends;

//    Users.find({ friends: "yyh2" }, function (err, docs) {
//      console.log(docs);
//      docs.forEach(function (doc) {
//        if (!friends.includes(doc.name))
//          friends.push(doc.name);
//      });
//      res.json(friends);
//    });
//  });
//});

router.post('/', function (req, res) {
  Users(req.body).save(function (err, data) {
    if (err) {
      res.json(400, err);
    }
    console.log(data);
    res.json(data);
  });
});

router.put('/:name', urlencodedParser, function (req, res) {
  Users.findOneAndUpdate({ name: req.body.name }, req.body, { new: true }, function (err, doc) {
    if (err) {
      res.json(400, err);
    }
    else {
      if (doc == null) {
        res.json(404, { error: "Doc not found" });
      } 
      else {
        Users.update({ friends: req.body.name }, { $pull: { friends: req.body.name } }, { multi: true }, function (err, doc) {
          req.body.friends.forEach(function (friend) {
            console.log(friend);
            Users.findOneAndUpdate({ name: friend }, { $addToSet: { friends: req.body.name } }, function (err, doc) {
              console.log(doc);
            })
          })
          res.json(doc);
        })
      }
    }
  });
});

router.delete('/:name', function (req, res) {
  Users.find({ name: req.params.name }).deleteOne(function (err, data) {
    if (err) {
      res.json(400, err);
    }
    res.json(data);
  });
});

module.exports = router;

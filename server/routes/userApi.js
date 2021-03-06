var express = require('express');
var router = express.Router();

var UserSchema = require('../model/schema.js').getUserSchema();

// All request node
router.use(function (req, res, next) {
  console.log('User api called.');
  // allows requests from angularJS frontend applications
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next(); // go to the next route
});

router.route('/')
  // Liste des utilisateurs
  .get(function (req, res) {
    console.log('GET all users');
    var query = UserSchema.find({}).select('-password');
    query.exec(function (err, users) {
      if (err) {
        console.log(err);
        return;
      }

      res.status(200);
      return res.send(users);
    });
  })
  // Inscription
  .post(function (req, res) {
    console.log('POST a user');

    if (!req.body.hasOwnProperty('username') || !req.body.hasOwnProperty('password') || !req.body.hasOwnProperty('email') ||
      req.body.username === "" || req.body.password === "" || req.body.email === "") {
      res.status(400);
      return res.json({message: "incorrect syntax"});
    }

    UserSchema.findOne({'username': req.body.username}, function(err, verif) {
      if(verif) {
        console.log("Username already exists");
        res.status(405);
        return res.json({message: "username already exists"});
      } else {
        var user = new UserSchema();

        user.username = req.body.username;
        user.password = req.body.password;
        user.email = req.body.email;

        user.save(function (err) {
          if (err) {
            res.status(400);
            return res.json({message: "Invalid syntax"});
          }
          user.password = undefined;
          res.status(201);
          return res.send(user);
        });
      }
    });
  });

router.route('/auth')
  // Connection
  .post(function (req, res) {
    console.log('POST user authentification');
    var query = UserSchema.findOne({'username': req.body.username, 'password': req.body.password}).select('-password');
    query.exec(function (err, user) {
      if (err || !user) {
        res.status(404);
        return res.json({message: "User does not exist"});
      }

      res.status(200);
      return res.send(user);
    });
  });

// Route sur User
router.route('/:id')
  .get(function (req, res) {
    console.log('GET a user');
    var query = UserSchema.findOne({'_id': req.params.id}).select('-password');
    query.exec(function (err, user) {
      if (err) {
        res.status(404);
        return res.json({message: "User unknowned"});
      }
      res.status(200);
      return res.send(user);
    });
  })
  .put(function (req, res) {
    console.log('PUT a user');
    UserSchema.findOne({'_id': req.params.id}, function (err, user) {
        if (err || !user) {
          res.status(404);
          return res.json({message: "User unknowned"});
        }

        if (req.body.username !== undefined) {
          user.username = req.body.username;
        }
        if (req.body.password !== undefined) {
          user.password = req.body.password;
        }
        if (req.body.email !== undefined) {
          user.email = req.body.email;
        }
        if (req.body.pedals !== undefined) {
          if (req.body.pedals.constructor === Array) {
            for (var i = 0; i < req.body.pedals.length; i++) {
              user.pedals.push({
                _id: req.body.pedals[i]
              });
            }
          }
          else {
            user.pedals.push({
              _id: req.body.pedals
            });
          }
        }
        if (req.body.shared !== undefined) {

          if (req.body.shared.constructor === Array) {

            for (var j = 0; j < req.body.shared.length; j++) {
              console.log(req.body.shared[j]);
              user.shared.push(
                {
                  _id: req.body.shared[j].id
                }
              );
            }
          }
          else {
            user.shared.push(
              {
                _id: req.body.shared
              }
            );
          }
        }

        user.save(function (err) {
          if (err) {
            res.stats(400);
            return res.json({message: "Invalid syntax"});
          }
          user.password = undefined;
          res.status(200);
          return res.send(user);
        });
      }
    );
  });
module.exports = router;

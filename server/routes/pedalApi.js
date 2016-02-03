var express = require('express');
var router = express.Router();

var Dao = require('../model/dao');

var PedaleSchema = require('../model/schema').getPedaleSchema();


// ---------------------------
// Middleware for all requests
// ---------------------------
router.use(function (req, res, next) {
  console.log('Middleware called.');
  // allows requests from angularJS frontend applications
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next(); // go to the next route
});


/*
 ------------------------------
 PEDALES
 ------------------------------
 */
var noteRouter = require('./noteApi');
var commentRouter = require('./commentApi');
router.use('/:pedalId/notes', noteRouter);
router.use('/:pedalId/comments', commentRouter);

//##########POST > Route -> /api/pedale###########

router.route('/')
  .post(function (req, res) {
    console.log('POST a pedal');
    var pedale = new PedaleSchema();

    pedale.nom = req.body.nom;
    pedale.description = req.body.description;
    pedale.owner = req.body.owner;

    if (req.body.effets !== undefined && req.body.effets.constructor === Array) {
      for (var i = 0; i < req.body.effets.length; i++) {
        pedale.effets.push({
          data: req.body.effets[i].data
        });
      }

    } else {
      pedale.effets = [];
    }

    pedale.save(function (err) {
      if (err) {
        res.status(400);
        return res.json(err);
      }
      res.status(201);
      return res.send(pedale);
    });
  });

// Actions sur une pédale
router.route('/:id')
  .get(function (req, res) {
    console.log('GET a pedal');
    PedaleSchema.findOne({'_id': req.params.id}, function (err, pedale) {
      if (err) {
        res.status(404);
        return res.json({message: "Unknowned pedal"});
      }
      res.status(200);
      return res.send(pedale);
    });
  })
  .put(function (req, res) {
    console.log('PUT a pedal');
    PedaleSchema.findOne({'_id': req.params.id}, function (err, pedale) {
        if (err) {
          res.status(404);
          return res.json({message: "unknowned pedal."});
        }

        if (req.body.nom !== undefined) {
          pedale.nom = req.body.nom;
        }
        if (req.body.description !== undefined) {
          pedale.description = req.body.description;
        }

        if (req.body.effets !== undefined && req.body.effets.constructor === Array) {
          pedale.effets = [];

          for (var i = 0; i < req.body.effets.length; i++) {
            pedale.effets.push({
              data: req.body.effets[i].data
            });
          }
        }

        pedale.save(function (err) {
          if (err) {
            console.log(err);
            return;
          }
          res.status(200);
          return res.send(pedale);
        });
      }
    )

  })
  .delete(function (req, res) {
    console.log('DELETE a pedal');
    PedaleSchema.remove({_id: req.params.id}, function (err) {
      if (err) {
        res.status(404);
        return res.json({message: "unknowned pedal"});
      }
      res.status(200);
      return res.json({message: 'Successfully deleted'});
    });
  });
router.route('/:id/users/')
  .get(function (req, res) {
    console.log('GET users of pedal');
    PedaleSchema.findOne(
      {"users": {$exists: true}, "_id": req.params.id},
      {"users": 1},
      function (err, pedal) {
        if (err) {
          res.status(404);
          return res.json({message: "Post syntax incorrect, pedalid not specified or empty"});
        }
        res.status(200);
        return res.send(pedal.users);
      }
    );
  })
  .put(function (req, res) {
    console.log('PUT users of pedal');
    if (req.body.constructor !== Array || req.body.length == 0) {
      res.status(400);
      return res.json({message: "Put syntax incorrect"});
    }

    PedaleSchema.findOne({'_id': req.params.id}, function (err, pedale) {
      if (err) {
        res.status(404);
        return res.json({message: "Unknowned pedal"});
      }

      pedale.users = [];
      for (var i = 0; i < req.body.length; i++) {
        pedale.users.push({
          _id: req.body[i]
        })
      }

      pedale.save(function (err) {
        if (err) {
          res.status(404);
          return res.json({message: "This pedal doesn't exists."});
        }
        res.status(200);
        return res.send(pedale);
      });
    });
  });
module.exports = router;

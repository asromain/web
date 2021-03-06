var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var fs = require('fs');
var Grid = require('gridfs-stream');
Grid.mongo = mongoose.mongo;
//si utilisation d'un formulaire pour uploader fichier:
var formidable = require('formidable');


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


// ---------------------------
// POST > Route ➜ /api/file
// ---------------------------
router.post('/', function (req, res) {
  console.log("POST a file");

  var fileToSave = req.files.filefield;    // champ à renseigner

  // on cree une connexion avec la BD
  var dbname = (process.env.NODE_ENV == 'test') ? 'dbsound_test' : 'dbsound';
  var conn = mongoose.createConnection('localhost', dbname, 27017);

  // check les erreurs
  conn.on('error', function (err) {
    if (err) {
      console.log(err);
      res.status(404);
      return;
    }
  });

  // enregistrement du ficher via la connexion
  conn.once('open', function () {
    var gfs = Grid(conn.db);

    var writeStream = gfs.createWriteStream({
      filename: fileToSave.name,
      mode: 'w',
      content_type: fileToSave.mimetype
    });

    writeStream.on('close', function () {
      return res.status(201).send({
        "message": "File uploaded"
      });
    });

    writeStream.write(fileToSave.data);
    writeStream.end();
  });
});

// ----------------------------------
// GET > Route ➜ /api/file/:musicname
// ----------------------------------
router.get('/:musicname', function (req, res) {

  // on cree une connexion avec la BD
  var dbname = (process.env.NODE_ENV == 'test') ? 'dbsound_test' : 'dbsound';
  var conn = mongoose.createConnection('localhost', dbname, 27017);

  // check les erreurs
  conn.on('error', function (err) {
    if (err) {
      console.log(err);
      res.status(404);
      return;
    }
  });

  // recupere le ficher via la connexion
  conn.once('open', function () {
    var gfs = Grid(conn.db);

    var musicName = req.params.musicname + ".ogg";

    gfs.findOne({filename: musicName}, function (err, file) {
      if (err) return res.status(400).send(err);
      if (!file) return res.status(404).send(err);

      //res.status(200);
      //return res.json({"id": file._id});

      res.set('Content-Type', file.contentType);
      res.set('Content-Disposition', 'attachment; filename="' + file.filename + '"');

      //console.log(file._id);

      var readStream = gfs.createReadStream({
        _id: file._id
        // mode: 'r'
      });

      readStream.on('error', function (err) {
        console.log('Error while processing stream' + err);
        throw err;
      });

      res.status(200);
      readStream.pipe(res);
    });
  });
});


// -------------------------------
// POST via html5 form
// Route ➜ /api/form/file
// comment lines 8 et 9 in app.js
// 	  busboyBodyParser
// -------------------------------
router.post('/form/', function (req, res) {

  var form = new formidable.IncomingForm();
  // stockage en local aussi
  form.uploadDir = __dirname + "/data";
  form.keepExtensions = true;

  form.parse(req, function (err, fields, files) {
    if (!err) {
      console.log('File uploaded : ' + files.file.path);
      console.log('File name: ' + files.file.name);
      console.log('File type: ' + files.file.type);
      console.log('File size: ' + files.file.size);

      var dbname = (process.env.NODE_ENV == 'test') ? 'dbsound_test' : 'dbsound';
      var conn = mongoose.createConnection('localhost', dbname, 27017);

      conn.once('open', function () {
        var gfs = Grid(conn.db);
        var writeStream = gfs.createWriteStream({
          filename: files.file.name
        });
        fs.createReadStream(files.file.path).pipe(writeStream);
      });
    }
  });

  form.on('end', function () {
    res.send('Completed ...');
  });
});


// ---------------------------
// Pour utilisation via form
// GET > Route ➜ /api
// ---------------------------
router.get('/', function (req, res) {
  res.send(
    '<form method="post" action="/api/file/form" enctype="multipart/form-data">'
    + '<input type="file" id="file" name="file"><br/>'
    + '<input type="submit" value="submit">'
    + '</form>'
  );
});


module.exports = router;

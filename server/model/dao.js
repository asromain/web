/**
 * Created by Romain on 11/01/2016.
 */

var mongoose = require('mongoose');

var db = {
  //TODO Pour faire genre
  //production: "mongodb://user:pass@example.com:1234/dbsound-prod",
  development: "mongodb://localhost:27017/dbsound",
  test: "mongodb://localhost:27017/dbsound_test"
};

var getDao = function() {
  return mongoose.connect(db[process.env.NODE_ENV]);
};

exports.getDao = getDao;

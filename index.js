const express = require('express');
var bodyParser = require("body-parser");
const clientRouter = require('./server/routes/route');
var Grid = require("gridfs-stream");
var fs = require('fs');
const app = express();
const path = require('path');

//Mongo connection 
const MongoClient = require('mongodb').MongoClient;
const mongodb = require('mongodb');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const assert = require('assert');
const uri = "mongodb+srv://deep:dnp@4283@cluster0-kdmbn.mongodb.net";
const dbName = 'mayorwilson';

const port = process.env.PORT || 3000;
const www = process.env.WWW || './';
app.use(express.static(www));
console.log(`serving ${www}`);

app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get('/', (req, res) => {
  res.sendFile(path.resolve('./public/pages/login.html'));
});

app.use(/*route*/ '/', /*router*/ clientRouter);

/**
 * Save photo to mongodb
 * 
 */
app.post('/api/photos', function (req, res) {
  Grid.mongo = mongoose.mongo;
  MongoClient.connect(uri, function (err, client) {
    const db = client.db(dbName);
    var bucket = new mongodb.GridFSBucket(db);
    fs.createReadStream('./dog.jpg').
      pipe(bucket.openUploadStream('dog.jpg')).
      on('error', function (error) {
        assert.ifError(error);
      }).
      on('finish', function () {
        console.log('done!');
        client.close();
        res.status(200).send("image saved!");
      });
  });


});

/*
* Sign Up 
*
*/
app.post('/sign_up', function (req, res) {
  console.log(req.body);
  var name = req.body.name;
  var email = req.body.email;
  var pass = req.body.password;
  var biography = req.body.biography;
  var associate = req.body.associate;
  var associate_culture_checkbox = req.body.associate_culture_checkbox;
  var tags = req.body.tags;
  var agencies = req.body.agencies;

  var data = {
    "name": name,
    "email": email,
    "password": pass,
    "biography": biography,
    "associate": associate,
    "associate_culture_checkbox": associate_culture_checkbox,
    "tags": tags,
    "agencies": agencies
  }

  MongoClient.connect(uri, function (err, client) {
    assert.equal(null, err);
    console.log("Connected successfully to MongoDB");
    const db = client.db(dbName);
    db.collection('details').insertOne(data, function (err, collection) {
      if (err) {
        res.send(400).send(err);
        console.log(err);
      }
      console.log("Record inserted Successfully");
      res.status(200).send("data saved!");
    });
    client.close();
  })
});


/*
* Login 
*
*/
app.post('/login', function (req, res) {
  console.log(req.body);
  var email = req.body.email;
  var pass = req.body.password;
  var data = {
    "email": email,
    "password": pass
  }
  var dbResult;
  MongoClient.connect(uri, function (err, client) {
    const db = client.db(dbName);
    if (err) throw err;
    db.collection("details").find({}).toArray(function (err, result) {
      if (err) throw err;
      console.log(result);
      dbResult = result;
      client.close();
      var resV = false;
      var resData;
      dbResult.forEach((user) => {
        if (user.email == email && user.password == pass) {
          resV = true;
          resData = user;
        }
      });
      console.log('result:' + resV);
      if (resV)
        res.sendFile(path.resolve('./public/pages/index.html'));
      else
        res.status(404).send('Invalid username and password');
    });
  });

  return null;

  // return res.redirect('signup_success.html'); 
});

app.listen(port, () => console.log(`listening on http://localhost:${port}`))
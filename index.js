const express = require('express');
var bodyParser = require("body-parser");
const clientRouter = require('./server/routes/route');
var User1 = require('../ArtGallry/public/schema/user');
const app = express();
const path = require('path');

const port = process.env.PORT || 3000;

const www = process.env.WWW || './';


//Mongo connection 
const MongoClient = require('mongodb').MongoClient;
var mongoose = require('mongoose');
var multer = require('multer');
var Schema = mongoose.Schema;
const assert = require('assert');
const uri = "mongodb+srv://deep:dnp@4283@cluster0-kdmbn.mongodb.net";
const dbName = 'mayorwilson';

app.use(express.static(www));
console.log(`serving ${www}`);


app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get('/', (req, res) => {
  res.sendFile(path.resolve('./public/pages/index.html'));
});

app.use(/*route*/ '/', /*router*/ clientRouter);
//mongo code
//schema 
// var ItemSchema = new Schema(
//   { img: 
//       { data: Buffer, contentType: String }
//   }
// );
// var Item = mongoose.model('Clothes',ItemSchema);

// //multer middleware to  the path of the image we are uploading.
// app.use(multer({ dest: './uploads/',
//   rename: function (fieldname, filename) {
//     return filename;
//   },
//  }).any());


//  app.post('/api/photos',function(req,res){
//   var newItem = new Item();
//   newItem.img.data = fs.readFileSync(req.files.userPhoto.path)
//   newItem.img.contentType = 'image/jpg';
//   newItem.save();
//  });







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
      if (err) throw err;
      console.log("Record inserted Successfully");
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
  MongoClient.connect(uri, function (err, client) {
    assert.equal(null, err);
    console.log("Connected successfully to MongoDB");
    const db = client.db(dbName);
    db.collection('details').insertOne(data, function (err, collection) {
      if (err) throw err;
      console.log("Record inserted Successfully");
    });
    client.close();
  });
  return null;

  // return res.redirect('signup_success.html'); 
});

app.listen(port, () => console.log(`listening on http://localhost:${port}`))
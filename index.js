const express = require('express');
const clientRouter = require('./server/routes/route');
const app = express();
const path = require('path');

const port = process.env.PORT || 3000;

const www = process.env.WWW || './';


//Mongo connection 
const MongoClient = require('mongodb').MongoClient;
var mongoose = require('mongoose');
var multer = require('multer');
var Schema = mongoose.Schema;
const assert= require('assert');
const uri = "mongodb+srv://deep:dnp@4283@cluster0-kdmbn.mongodb.net";
const dbName = 'mayorwilson';

app.use(express.static(www));

console.log(`serving ${www}`);

app.get('/', (req, res) => {
    
    res.sendFile(path.resolve('./public/pages/index.html'));
});

app.use(/*route*/ '/', /*router*/ clientRouter);


//mongo code
//schema 
var ItemSchema = new Schema(
  { img: 
      { data: Buffer, contentType: String }
  }
);
var Item = mongoose.model('Clothes',ItemSchema);

//multer middleware to  the path of the image we are uploading.
app.use(multer({ dest: './uploads/',
  rename: function (fieldname, filename) {
    return filename;
  },
 }).any());


 app.post('/api/photos',function(req,res){
  var newItem = new Item();
  newItem.img.data = fs.readFileSync(req.files.userPhoto.path)
  newItem.img.contentType = 'image/jpg';
  newItem.save();
 });


MongoClient.connect(uri, function(err, client) {
  assert.equal(null, err);
  console.log("Connected successfully to MongoDB");
  const db = client.db(dbName);
  //insertDocuments(db, function() {
    // client.close();
  // });
  client.close();
});

app.listen(port, () => console.log(`listening on http://localhost:${port}`));

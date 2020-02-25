const express = require("express");
const session = require("express-session");
var bodyParser = require("body-parser");
const clientRouter = require("./server/routes/route");
var Grid = require("gridfs-stream");
var fs = require("fs");
const app = express();
const path = require("path");
const swal = require('sweetalert');
var cookieParser = require('cookie-parser');
var flash = require('connect-flash');
app.use(cookieParser('secret'));
app.use(session({ cookie: { maxAge: 60000 } }));
app.use(flash());

app.use(function (req, res, next) {
  res.locals.success_messages = req.flash('success_messages');
  res.locals.error_messages = req.flash('error_messages');
  next();
});
//Mongo connection
const MongoClient = require("mongodb").MongoClient;
const mongodb = require("mongodb");
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const assert = require("assert");
const uri = "mongodb+srv://deep:dnp@4283@cluster0-kdmbn.mongodb.net";
const dbName = "mayorwilson";

const port = process.env.PORT || 3000;
const www = process.env.WWW || "./";
app.use(express.static(www));
console.log(`serving ${www}`);

app.use(bodyParser.json());
app.use(express.static("public"));
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

app.use(session({
  name: 'sid',
  resave: false,
  saveUninitialized: true,
  secret: 'secret',
  cookie: {
    maxAge: 5000 * 60 * 60 * 60,
    sameSite: true

  }
}));

app.use((req, res, next) => {
  const { userId } = req.session;
  if (userId) {
    res.locals.userId = req.session.userId;
    res.locals.userName = req.session.userName;

  }
  next()


});
// Get - LoginPage
app.get("/", (req, res) => {
  console.log(res.locals.userId);
  res.sendFile(path.resolve("./public/pages/login.html"));
});


//Get - Index.html
app.get("/home", (req, res) => {
  console.log(res.locals.userId);
  if (req.session.userId == undefined) {
    res.sendFile(path.resolve("./public/pages/login.html"));
  }
  else {
    res.sendFile(path.resolve("./public/pages/index.html"));
  }
});
app.get("/index", (req, res) => {
  console.log(res.locals.userId);
  if (req.session.userId == undefined) {
    res.sendFile(path.resolve("./public/pages/login.html"));
  }
  else {
    res.sendFile(path.resolve("./public/pages/index.html"));
  }
});


//Get - user detail for header.html
app.get("/names", (req, res) => {
  console.log(req.session.userId + " name: " + req.session.userName);

  if (req.session.userId == 'undefined') {
    res.sendFile(path.resolve("./public/pages/login.html"));
  }
  else {
    res.send({ id: req.session.userId, name: req.session.userName });
  }
});




app.use(/*route*/ "/", /*router*/ clientRouter);

/**
 * Save photo to server
 *
 */
const multer = require("multer");

const handleError = (err, res) => {
  res
    .status(500)
    .contentType("text/plain")
    .end("Oops! Something went wrong!");
};

const upload = multer({
  dest: "app/uploaded/files"
  // you might also want to set some limits: https://github.com/expressjs/multer#limits
});

app.post(
  "/upload",
  upload.single(
    "userPhoto" /* name attribute of <file> element in your form */
  ),
  (req, res) => {
    const tempPath = req.file.path;
    console.log(tempPath);
    const targetPath = path.join(__dirname, "./uploads/" + req.body.userPhoto);
    // if (path.extname(req.file.originalname).toLowerCase() === ".png") {
    if (path.extname(req.file.originalname).toLowerCase() === ".jpg") {
      fs.rename(tempPath, targetPath + ".png", err => {
        if (err) return handleError(err, res);
        res.redirect("/imageUpload/?" + req.body.userPhoto);
      });
    } else {
      fs.unlink(tempPath, err => {
        if (err) return handleError(err, res);
        res
          .status(403)
          .contentType("text/plain")
          .end("Only .png files are allowed!");
      });
    }
  }
);

/**
 * Save photo to mongodb
 *
 */
app.post("/api/photos", function (req, res) {
  Grid.mongo = mongoose.mongo;
  MongoClient.connect(uri, function (err, client) {
    const db = client.db(dbName);
    var bucket = new mongodb.GridFSBucket(db);
    fs.createReadStream("./public/resources/" + req.body.userPhoto)
      .pipe(bucket.openUploadStream(req.body.userPhoto))
      .on("error", function (error) {
        assert.ifError(error);
      })
      .on("finish", function () {
        console.log("done!");
        client.close();
        res.status(200).send("image saved!");
      });
  });
});

/*
 * Sign Up
 *
 */
app.post("/sign_up", function (req, res) {

  console.log(req.body);
  var name = req.body.name;
  var email = req.body.email;
  var pass = req.body.password;
  var biography = req.body.biography;
  var associate = req.body.associate;
  var associate_culture_checkbox = req.body.associate_culture_checkbox;
  var tags = req.body.tags;
  var agencies = req.body.agencies;
  var artistWallet = req.body.artistWallet;
  axios.post(`http://localhost:8080/artistRegister/`, {
    address: artistWallet
  });
  var data = {
    name: name,
    email: email,
    password: pass,
    biography: biography,
    associate: associate,
    associate_culture_checkbox: associate_culture_checkbox,
    tags: tags,
    agencies: agencies
  };
  MongoClient.connect(uri, function (err, client) {
    assert.equal(null, err);
    console.log("Connected successfully to MongoDB");
    const db = client.db(dbName);
    db.collection("details").insertOne(data, function (err, collection) {
      if (err) {
        res.send(400).send(err);
        console.log(err);
      }
      console.log("Record inserted Successfully");
      res.status(200).send('<script>swal("data saved!")</script>');
    });
    client.close();
  });
});


/**
 * 
 * Logout
 * 
 */
app.get('/logout', (req, res) => {
  if (res.locals.userId != 'undefined') {
    req.session.destroy(err => {
      if (err) {
        console.log(err);
        res.redirect('/');
      }
      console.log('logging out ' +res.locals.userName)
      res.clearCookie('sid');
      res.redirect('/');
    })
  }else{
    res.redirect('/');
  }
});
/*
 * Login
 *
 */
app.post("/login", async (req, res) => {

  // if(req.session.userId=='wrong'){
  //   res.status(400).send('Already Logged In');
  // }else
  {
    var email = req.body.email;
    var pass = req.body.password;
    console.log(email);
    console.log(pass);
    var data = {
      email: email,
      password: pass
    };
    var dbResult;
    MongoClient.connect(uri, function (err, client) {
      const db = client.db(dbName);
      if (err) throw err;
      db.collection("details")
        .find({})
        .toArray(function (err, result) {
          if (err) throw err;
          //console.log(result);
          dbResult = result;
          client.close();
          var resV = false;
          var resData;
          dbResult.forEach(user => {
            if (user.email == email && user.password == pass) {
              resV = true;
              resData = user;
            }
          });
          console.log("result:" + resV);
          if (resV) {
            req.session.userId = resData._id;
            req.session.userName = resData.name;
            // console.log(req.session.userId);
            //res.sendFile(path.resolve("./public/pages/index.html"));
            res.status(200).json('success!');
            //res.send("success");
          }
          else {
            // req.flash('error','roor');
            //res.redirect('/');
            // res.send("fail");
            res.status(400).json('oh noes!');
          }
        });
    });
    return null;
  }
  // return res.redirect('signup_success.html');
});

app.listen(port, () => console.log(`listening on http://localhost:${port}`));

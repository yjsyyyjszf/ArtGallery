const express = require("express");
const session = require("express-session");
var bodyParser = require("body-parser");
const clientRouter = require("./server/routes/route");
var Grid = require("gridfs-stream");
var fs = require("fs");
const app = express();
const path = require("path");
const cors = require("cors");
const Web3 = require("web3");
const abi = require("./abi");
const Tx = require("ethereumjs-tx");
const BigNumber = require("bignumber.js");
var cookieParser = require("cookie-parser");
var flash = require("connect-flash");
app.use(cookieParser("secret"));
app.use(session({ cookie: { maxAge: 60000 } }));
app.use(flash());

let web3;
let DRM_address = "0x160db70990723b3dbdfc43828a61f68d48f2b650";
let DRM_owner = "0x5efDD3CAb3c3Ea3D1725B8EaF340Cc8d5a9B7547";
let DRM_ownerKey =
  "45F93E7A6CF774228519708AA97529A9CE2A663E26E67F183FE49BB9C90D468D";

var infuraLink =
  "https://rinkeby.infura.io/v3/7a19de34892e4625b8464eac960146b7";
web3 = new Web3(new Web3.providers.HttpProvider(infuraLink));
let DRM = new web3.eth.Contract(abi, DRM_address);

app.use(function(req, res, next) {
  res.locals.success_messages = req.flash("success_messages");
  res.locals.error_messages = req.flash("error_messages");
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

app.use(
  session({
    name: "sid",
    resave: false,
    saveUninitialized: true,
    secret: "secret",
    cookie: {
      maxAge: 5000 * 60 * 60 * 60,
      sameSite: true
    }
  })
);

app.use((req, res, next) => {
  const { userId } = req.session;
  if (userId) {
    res.locals.userId = req.session.userId;
    res.locals.userName = req.session.userName;
  }
  next();
});
// Get - LoginPage
app.get("/", (req, res) => {
  console.log(res.locals.userId);
  res.sendFile(path.resolve("./public/pages/login.html"));
});

//Get - profile page
app.get("/profile", (req, res) => {
  console.log(res.locals.userId);
  if (req.session.userId == undefined) {
    res.sendFile(path.resolve("./public/pages/profile.html"));
  } else {
    res.sendFile(path.resolve("./public/pages/profile.html"));
  }
});
//Get - Index.html
app.get("/home", (req, res) => {
  console.log(res.locals.userId);
  if (req.session.userId == undefined) {
    res.sendFile(path.resolve("./public/pages/login.html"));
  } else {
    res.sendFile(path.resolve("./public/pages/index.html"));
  }
});
app.get("/index", (req, res) => {
  console.log(res.locals.userId);
  if (req.session.userId == undefined) {
    res.sendFile(path.resolve("./public/pages/login.html"));
  } else {
    res.sendFile(path.resolve("./public/pages/index.html"));
  }
});

//Get - user detail for header.html
app.get("/names", (req, res) => {
  console.log(req.session.userId + " name: " + req.session.userName);

  if (req.session.userId == "undefined") {
    res.sendFile(path.resolve("./public/pages/login.html"));
  } else {
    res.send({ id: req.session.userId, name: req.session.userName });
  }
});

//Get - user detail for header.html
app.get("/user/data", (req, res) => {
  if (req.session.userId == "undefined") {
    res.sendFile(path.resolve("./public/pages/login.html"));
  } else {
    var dbResult;
    MongoClient.connect(uri, function(err, client) {
      const db = client.db(dbName);
      if (err) throw err;
      db.collection("details")
        .find({})
        .toArray(function(err, result) {
          if (err) throw err;
          dbResult = result;
          client.close();
          var resV = false;
          var resData;
          dbResult.forEach(user => {
            console.log(user._id);
            if (user._id == req.session.userId) {
              resV = true;
              resData = user;
            }
          });
          console.log("result:" + resV);
          if (resV) {
            console.log(resData);
            res.status(200).json(resData);
          } else {
            console.log(req.session.userId)
            res.status(400).json("oh noes!");
          }
        });
    });
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
  async (req, res) => {
    const tempPath = req.file.path;
    console.log(req.file);
    console.log("tempPath :" + tempPath);
    const targetPath = path.join(__dirname, "./uploads/" + req.body.title);
    // if (path.extname(req.file.originalname).toLowerCase() === ".png"){
    // if (path.extname(req.file.originalname).toLowerCase() === ".jpg") {
    fs.rename(tempPath, targetPath + ".png", err => {
      if (err) return handleError(err, res);
    });
    // } else {
    //   fs.unlink(tempPath, err => {
    //     if (err) return handleError(err, res);
    //     res
    //       .status(403)
    //       .contentType("text/plain")
    //       .end(err);
    //   });
    var url = `https://artgallery07.herokuapp.com/uploads/${req.body.title}.png`;
    try {
      var wallet = req.body.artistWallet;
      console.log(wallet);
      var contributes = req.body.contributes; // address array -- [addr1, addr2]
      if (contributes == undefined) {
        var arr = [];
        arr.push(wallet);
        contributes = arr;
        percentages = [];
      } else {
        contributes = contributes.split(",");
        var percentages = req.body.percentages; // % array 1-10 -- [5,5]
        percentages = percentages.split(",");
      }
      var constraints = req.body.constraints; // nullable string array -- ["School","Governmant","Bank"]
      var price = req.body.price;
      price = new BigNumber(price * 1000000000000000000);
      var num = req.body.num;
      var name = req.body.title;
      var artist = req.body.artists;
      var description = req.body.description;
      var realart = "";
      var thumbnail = url; // URL only
      /**
       *  upload File to server, generate an URL
       **/
      var metadata = [name, artist, description, realart, thumbnail];
      // console.log(contributes);
      // console.log(percentages);
      // console.log(price.toString());
      // console.log(metadata);
      // console.log(num);

      var transfer = await DRM.methods
        .tokenGenerate(
          contributes,
          percentages,
          constraints,
          price.toString(),
          metadata,
          num //deployNum
        )
        .encodeABI();
      await sendTxn(transfer);
      res.sendStatus(200);
    } catch (err) {
      console.log(err);
      res.send(err);
    }
  }
);

/**
 * Save photo to mongodb
 *
 */
// app.post("/api/photos", function(req, res) {
//   Grid.mongo = mongoose.mongo;
//   MongoClient.connect(uri, function(err, client) {
//     const db = client.db(dbName);
//     var bucket = new mongodb.GridFSBucket(db);
//     fs.createReadStream("./public/resources/" + req.body.userPhoto)
//       .pipe(bucket.openUploadStream(req.body.userPhoto))
//       .on("error", function(error) {
//         assert.ifError(error);
//       })
//       .on("finish", function() {
//         console.log("done!");
//         client.close();
//         res.status(200).send("image saved!");
//       });
//   });
// });

/*
 * Sign Up
 *
 */
app.post("/sign_up", async function(req, res) {
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
  var metamaskId = req.body.metamaskId;
  var category=req.body.category;

  var transfer = await DRM.methods
    .artistRegister(name, artistWallet)
    .encodeABI();
  await sendTxn(transfer);

  var data = {
    name: name,
    email: email,
    password: pass,
    biography: biography,
    category : category,
    associate: associate,
    associate_culture_checkbox: associate_culture_checkbox,
    tags: tags,
    agencies: agencies,
    metamaskId : metamaskId
  };
  MongoClient.connect(uri, function(err, client) {
    assert.equal(null, err);
    console.log("Connected successfully to MongoDB");
    const db = client.db(dbName);
    db.collection("details").insertOne(data, function(err, collection) {
      if (err) {
        res.send(400).send(err);
        console.log(err);
      }
      console.log("Record inserted Successfully");
      res.redirect("/");
    });
    client.close();
  });
});

/**
 *
 * Logout
 *
 */
app.get("/logout", (req, res) => {
  if (res.locals.userId != "undefined") {
    req.session.destroy(err => {
      if (err) {
        console.log(err);
        res.redirect("/");
      }
      console.log("logging out " + res.locals.userName);
      res.clearCookie("sid");
      res.redirect("/");
    });
  } else {
    res.redirect("/");
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
    MongoClient.connect(uri, function(err, client) {
      const db = client.db(dbName);
      if (err) throw err;
      db.collection("details")
        .find({})
        .toArray(function(err, result) {
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
            res.status(200).json("success!");
            //res.send("success");
          } else {
            // req.flash('error','roor');
            //res.redirect('/');
            // res.send("fail");
            res.status(400).json("oh noes!");
          }
        });
    });
    return null;
  }
  // return res.redirect('signup_success.html');
});
app.get("/getTokenName/", async (req, res) => {
  var name = await DRM.methods.owner().call();
  res.send(name);
});
app.post("/getOwnerTokens/", async (req, res) => {
  var address = req.body.address;
  var tokenList = await DRM.methods.tokensOwned(address).call();
  var resJson = [];
  if (tokenList.length) {
    for (var i = 0; i < tokenList.length; i++) {
      var artwork = await DRM.methods.artworks(tokenList[i]).call();
      artwork.id = tokenList[i];
      resJson.push(artwork);
    }
  }

  res.send(resJson);
});
app.get("/getOnStoreTokens/", async (req, res) => {
  var storeList = await DRM.methods.getOnStoreTokens().call();
  var resJson = [];
  if (storeList.length) {
    for (var i = 0; i < storeList.length; i++) {
      var artwork = await DRM.methods.artworks(storeList[i]).call();
      artwork.id = storeList[i];
      resJson.push(artwork);
    }
  }
  res.send(resJson);
});
app.post("/artistRegister/", async (req, res) => {
  try {
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});

app.get("/registeredArtists/", async (req, res) => {
  try {
    var list = await DRM.methods.getArtist().call();
    var arr = [];
    for (var i = 0; i < list.names.length; i++) {
      arr.push(list.names[i] + "-" + list.addresses[i]);
    }
    // console.log(arr);
    res.send(arr);
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});
// @param (string[]contributes,int[]percentages,string[]constraints,int priceWei,string name,string artist,string desc,string realart, string thumbnail)
app.post("/tokenGenerate/", async (req, res) => {
  try {
    var wallet = req.body.artistWallet;
    console.log(wallet);
    var contributes = req.body.contributes; // address array -- [addr1, addr2]
    if (contributes == undefined) {
      var arr = [];
      arr.push(wallet);
      contributes = arr;
      percentages = [];
    } else {
      contributes = contributes.split(",");
      var percentages = req.body.percentages; // % array 1-10 -- [5,5]
      percentages = percentages.split(",");
    }
    var constraints = req.body.constraints; // nullable string array -- ["School","Governmant","Bank"]
    var price = req.body.price;
    price = new BigNumber(price * 1000000000000000000);
    var num = req.body.num;
    var name = req.body.title;
    var artist = req.body.artists;
    var description = req.body.description;
    var realart = req.body.realart;
    var thumbnail = ""; // URL only
    /**
     *  upload File to server, generate an URL
     **/
    var metadata = [name, artist, description, realart, thumbnail];
    console.log(contributes);
    console.log(percentages);
    console.log(price.toString());
    console.log(metadata);
    console.log(num);

    var transfer = await DRM.methods
      .tokenGenerate(
        contributes,
        percentages,
        constraints,
        price.toString(),
        metadata,
        num //deployNum
      )
      .encodeABI();
    await sendTxn(transfer);
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});
async function sendTxn(transfer) {
  var count = await web3.eth.getTransactionCount(DRM_owner);
  rawTransaction = {
    from: DRM_owner,
    nonce: web3.utils.toHex(count),
    gasPrice: 10000000000,
    gasLimit: 2100000,
    to: DRM_address,
    value: "0x0",
    data: transfer,
    chainId: 0x04
  };
  var keyStr = DRM_ownerKey;

  var privKey = Buffer.from(keyStr, "hex");
  var tx = new Tx(rawTransaction);
  tx.sign(privKey);
  var serializedTx = tx.serialize();
  console.log(serializedTx);
  var txn = await web3.eth.sendSignedTransaction(
    "0x" + serializedTx.toString("hex")
  );
  console.log(txn);
}
app.listen(port, () => console.log(`listening on http://localhost:${port}`));

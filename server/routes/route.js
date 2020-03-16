const express = require("express");
const clientRouter = express.Router();
const path = require("path");
const visionAPI = require("../../public/google_vision/googleVision");

clientRouter.get("/client", (request, response) => {
  response.send("Under Maintenance");
});

clientRouter.get("/dependency/bootstrap", (request, response) => {
  response.sendFile(path.resolve("./public/pages/css/bootstrap.min.css"));
});

clientRouter.get("/index", (request, response) => {
  response.sendFile(path.resolve("./public/pages/index.html"));
});

clientRouter.get("/service", (request, response) => {
  response.sendFile(path.resolve("./public/pages/services.html"));
});

clientRouter.get("/contact", (request, response) => {
  response.sendFile(path.resolve("./public/pages/signUp.html"));
});

clientRouter.get("/about", (request, response) => {
  response.sendFile(path.resolve("./public/pages/about.html"));
});

clientRouter.get("/single", (request, response) => {
  response.sendFile(path.resolve("./public/pages/single.html"));
});
clientRouter.get("/shop", (request, response) => {
  response.sendFile(path.resolve("./public/pages/shop.html"));
});
clientRouter.get("/register", (request, response) => {
  response.sendFile(path.resolve("./public/pages/register.html"));
});
clientRouter.get("/imageUpload", (request, response) => {
  response.sendFile(path.resolve("./public/pages/imageUpload.html"));
});
clientRouter.get("/assets", (request, response) => {
  response.sendFile(path.resolve("./public/pages/assets.html"));
});
clientRouter.get("/imgrecognition", (request, response) => {
  response.sendFile(path.resolve("./public/pages/imagerecognition.html"));
});
clientRouter.get("/metamask", (request, response) => {
  response.sendFile(path.resolve("./public/pages/metamask.html"));
});
clientRouter.get("/header", (request, response) => {
  response.sendFile(path.resolve("./public/pages/header.html"));
});
clientRouter.get("/header_login", (request, response) => {
  response.sendFile(path.resolve("./public/pages/header_login.html"));
});
clientRouter.get("/header_login", (request, response) => {
  response.sendFile(path.resolve("./public/pages/profile.html"));
});
clientRouter.get("/api/imagerecognition", async (req, res) => {
  let file = req.query.file;
  console.log(file);
  let imageResponse = await visionAPI.getLabels(file);
  console.log(imageResponse);
  res.send(imageResponse);
});

//Export the home router for other modules to use
module.exports = clientRouter;

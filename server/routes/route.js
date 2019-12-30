const express = require('express');
const clientRouter = express.Router();
const path = require('path');

clientRouter.get( '/client', (request, response) => {
    response.send('Under Maintenance');
});

clientRouter.get('/dependency/bootstrap',(request,response)=>{
    response.sendFile(path.resolve('./public/pages/css/bootstrap.min.css'))
});

clientRouter.get( '/index', (request, response) => {
    response.sendFile(path.resolve('./public/pages/index.html'))
});

clientRouter.get( '/service', (request, response) => {
    response.sendFile(path.resolve('./public/pages/services.html'))
});

clientRouter.get( '/contact', (request, response) => {
    response.sendFile(path.resolve('./public/pages/ray.html'))
});

clientRouter.get( '/about', (request, response) => {
    response.sendFile(path.resolve('./public/pages/about.html'))
});

clientRouter.get( '/single', (request, response) => {
    response.sendFile(path.resolve('./public/pages/single.html'))
});

clientRouter.get( '/header', (request, response) => {
    response.sendFile(path.resolve('./public/pages/header.html'))
});



//Export the home router for other modules to use
module.exports = clientRouter;
var createError = require('http-errors');
var http = require('http')
var express = require('express');
var path = require('path');
const methodOverride = require('method-override')
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var passport = require('passport');
const mongoose = require('mongoose');
const hostname = 'localhost';
const port = process.env.PORT || 3000;
const app = express();

const url = 'mongodb://localhost:27017/blog';
const connect = mongoose.connect(url);

var usersRouter = require('./routes/user');
const blogRouter = require('./routes/Blogs');
var session = require('express-session');
var FileStore = require('session-file-store')(session);

const server = http.createServer(app);

server.listen(port, hostname, ()=>{
    console.log(`server running at https://${hostname}/${port}/`)
})

connect.then((db) =>{
    console.log('connected to server');
})

app.use(passport.initialize());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use(function (req, res, next) {
    //Enabling CORS
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization");
    next();
    });

//Method Override
app.use(methodOverride((req,res)=>{
  if(req.body && typeof req.body==='object' && '_method' in req.body){
    let method = req.body._method
    delete req.body._method
    return method
  }
}))

app.use('/users', usersRouter);
app.use('/blog',blogRouter);

module.exports = app;


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

var session = require('express-session');
var FileStore = require('session-file-store')(session);

const server = http.createServer(app);

server.listen(port, hostname, ()=>{
    console.log(`server running at https://${hostname}/${port}/`)
})

connect.then((db) =>{
    console.log('connected to server');
})


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


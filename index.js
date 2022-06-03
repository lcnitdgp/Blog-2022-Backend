var createError = require('http-errors');
require('dotenv').config()
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
require('./auth')
const url = 'mongodb+srv://architlall:architlall@cluster0.dlf2m.mongodb.net/?retryWrites=true&w=majority';

// const users = require('./routes/users')
// var usersRouter = require('./routes/user');
const blogRouter = require('./routes/Blogs');
var session = require('express-session');
var FileStore = require('session-file-store')(session);

const server = http.createServer(app);

mongoose.connect(url,{useNewUrlParser: true, useUnifiedTopology: true})
 .then((result)=> 
    app.listen((port),function(){
        console.log(`Server started at http://localhost:${port}`)
    })
  )

  app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

function isLoggedIn(req, res, next) {
  req.user ? next() : res.sendStatus(401);
}

app.use(session({ secret: 'cats', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());


app.get('/', (req, res) => {
  res.send('<a href="/auth/google">Authenticate with Google</a>');
});

app.get('/auth/google',
  passport.authenticate('google', { scope: [ 'email', 'profile' ] }
));

app.get( '/auth/google/callback',
  passport.authenticate( 'google', {
    successRedirect: '/protected',
    failureRedirect: '/auth/google/failure'
  })
);

app.get('/protected', isLoggedIn, (req, res) => {
  res.send(`Hello ${req.user.displayName}`);
});

app.get('/logout', (req, res) => {
  req.logout();
  req.session.destroy();
  res.send('Goodbye!');
});

app.get('/auth/google/failure', (req, res) => {
  res.send('Failed to authenticate..');
});



app.use('/blog',blogRouter);

module.exports = app;


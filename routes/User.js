var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
var User = require('../models/user');
var passport = require('passport');
var authenticate = require('../authenticate');
const userRouter = express.Router();

userRouter.use(express.json());

/* GET users listing. */
userRouter.route('/')
     .get(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
       User.find({})
       .then((users) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(users);
    }, (err) => next(err))
    .catch((err) => next(err));
})

  




userRouter.post('/signup', (req, res, next) => {
  User.register(new User({username: req.body.username}), 
    req.body.password, (err, user) => {
    if(err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({err: err});
    }
    else {
      if (req.body.name)
        user.name = req.body.name;
        if (req.body.email)
        user.email = req.body.email;
      user.save((err, user) => {
        if (err) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.json({err: err});
          return ;
        }
        passport.authenticate('local')(req, res, () => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({user, success: true, status: 'Registration Successful!'});
        });
      });
    }
  });
});
userRouter.post('/login', passport.authenticate('local'), (req, res) => {

  var token = authenticate.getToken({_id: req.user._id});
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  User.find({_id: req.user._id}).then((user)=>{
    res.json({user, token: token, status: 'You are successfully logged in!'});
  })
  
});
  
   

userRouter.get('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  }
  else {
    var err = new Error('You are not logged in!');
    err.status = 403;
    next(err);
  }
});

userRouter.put('/subscribe/:id', (req, res) => {
  User.find({_id: req.params._id}).then((user)=>{
    user.isSubscribed = true;
    user.save().then((user)=>{
      res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json(user)
    })
  })
});




module.exports = userRouter;
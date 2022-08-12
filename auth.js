const passport = require('passport')
const User = require('./models/user')
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
require('dotenv').config()

passport.use(new GoogleStrategy({
    clientID:     process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000",
    passReqToCallback   : true
  },
  function(request, accessToken, refreshToken, profile, done){
      console.log(profile)
      new User({
        googleId: profile.id,
        name: profile.displayName,
        email: profile.email,
        image: profile.picture,

    }).save().then((newUser) => {
        console.log('new user created: ', newUser);
        return done(null,profile)
    });
  }
));

passport.serializeUser(function(user,done){
    done(null,user);
})

passport.deserializeUser(function(user,done){
    done(null,user);
})
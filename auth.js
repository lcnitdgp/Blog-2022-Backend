const passport = require('passport')
const User = require('./models/user')
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
const GOOGLE_CLIENT_ID = '1085366071715-qaoqajrg4dfaoqscqpj036tgd7rhuhvn.apps.googleusercontent.com'
const GOOGLE_CLIENT_SECRET = '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'

passport.use(new GoogleStrategy({
    clientID:     GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback",
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
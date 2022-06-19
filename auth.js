const passport=require('passport');
const process = require('process');
require("dotenv").config();
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
const PORT = process.env.PORT || 3000;
//clientID:     GOOGLE_CLIENT_ID,
//clientSecret: GOOGLE_CLIENT_SECRET,

var googleAuthURL=`http://localhost:${PORT}/google/callback`;
if (process.env.NODE_ENV === "production") {
  googleAuthURL = `https://video-group-chat-12.herokuapp/google/callback`
}


passport.use(new GoogleStrategy({
    clientID:process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: googleAuthURL,
    passReqToCallback   : true
  },
  function(request, accessToken, refreshToken, profile, done) {
    return done(null,profile)
  }
));
passport.serializeUser(function(user,done){
    done(null,user)
});
passport.deserializeUser(function(user,done){
    done(null,user)
});
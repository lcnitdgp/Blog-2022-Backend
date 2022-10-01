var createError = require("http-errors");
require("dotenv").config();
var http = require("http");
var express = require("express");
var path = require("path");
const methodOverride = require("method-override");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var passport = require("passport");
const mongoose = require("mongoose");
const hostname = "localhost";
const { connectDB } = require("./config/db");
const port = 5000;
const app = express();
const cron = require("node-cron");

var authenticate = require("./authenticate");
const cors = require("cors");
require("./auth");
var bodyParser = require("body-parser");

connectDB();
// const users = require('./routes/users')
// var usersRouter = require('./routes/user');
const blogRouter = require("./routes/Blogs");
const userRouter = require("./routes/User");
const msgRouter = require("./routes/message");
var session = require("express-session");
var FileStore = require("session-file-store")(session);

const server = http.createServer(app);

app.listen(port, () => console.log(`Server running on port ${port}`));

app.use(cors());
app.use(logger("dev"));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);

function isLoggedIn(req, res, next) {
  req.user ? next() : res.sendStatus(401);
}

app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// app.get('/', (req, res) => {
//   res.send('<a href="/auth/google">Authenticate with Google</a>');
// });

// app.get('/auth/google',
//   passport.authenticate('google', { scope: [ 'email', 'profile' ] }
// ));

// app.get( '/auth/google/callback',
//   passport.authenticate( 'google', {
//     successRedirect: '/protected',
//     failureRedirect: '/auth/google/failure'
//   })
// );

// app.get('/protected', isLoggedIn, (req, res) => {
//   console.log('googl success');
//   //res.send(`Hello ${req.user.displayName}`);
// });

// app.get("/logout", (req, res) => {
//   req.logout();
//   req.session.destroy();
//   res.send("Goodbye!");
// });

// app.get("/auth/google/failure", (req, res) => {
//   res.send("Failed to authenticate..");
// });

app.use("/user", userRouter);
app.use("/blog", blogRouter);
app.use("/message", msgRouter);

module.exports = app;

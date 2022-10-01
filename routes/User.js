var express = require("express");
var router = express.Router();
const bodyParser = require("body-parser");
var User = require("../models/user");
var passport = require("passport");
var authenticate = require("../authenticate");
const userRouter = express.Router();
var nodemailer = require("nodemailer");
userRouter.use(express.json());

const randString = () => {
  let len = 6;
  let randStr = "";
  for (let i = 0; i < len; i++) {
    //ch = a number between 1 to 10
    const ch = Math.floor(Math.random() * 10);
    randStr += ch;
  }
  return randStr;
};
const sendMail = (email, uniqueString) => {
  console.log("email sentttttttttttttttttttt");
  console.log(email);
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "archit10dgp@gmail.com",
      pass: "tnlltppcfspvcuzh",
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
  let mailOptions = {
    from: "archit10dgp@gmail.com",
    to: email,
    subject: "Email confirmation",
    text: `The OTP to verify your account is ${uniqueString}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) console.log(error);
    else console.log("Email sent: " + info.response);
  });
};

/* GET users listing. */
userRouter
  .route("/")
  .get(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    User.find({})
      .then(
        (users) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(users);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

userRouter.post("/signup", (req, res, next) => {
  User.register(
    new User({ username: req.body.username }),
    req.body.password,
    (err, user) => {
      console.log(user);
      if (err) {
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        res.json({ err: err });
      } else {
        if (req.body.name) user.name = req.body.name;
        console.log(req.body.email + "2");
        const email = req.body.email;

        console.log(email);
        user.email = req.body.email;

        user.isValid = false;
        const uniqueString = randString();
        user.uniqueString = uniqueString;
        //         if (req.body.email) {
        //           const { email } = req.body.email;
        //         }
        user.save(async (err, user) => {
          if (err) {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.json({ err: err });
            return;
          }
          console.log(email);
          await sendMail(email, uniqueString);
          res.send("email sent");
          passport.authenticate("local")(req, res, () => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json({
              user,
              success: true,
              status: "Registration Successful!",
            });
          });
         
        
        });
      }
    }
  );
});

userRouter.post("/googlelogin", async(req,res,next)=>{
  User.register(
    new User({
      googleId: profile.id,
      name: profile.displayName,
      email: profile.email,
      image: profile.picture,
      isValid: true

  }).save().then((newUser) => {
      console.log('new user created: ', newUser);
      return done(null,profile)
  })
  )});
  
         
  
   

userRouter.post("/verify", async (req, res, next) => {
  //getting the string
  console.log(req.body.uniqueString);
  const uniqueString = req.body.uniqueString;
  console.log(uniqueString);
  const user = await User.findOne({ uniqueString: uniqueString });
  if (user) {
    console.log(user);
    //if there is anyone, mark them verified
    user.isValid = true;
    user.save((err, user) => {
      if (err) {
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        res.json({ err: err });
        return;
      } else {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json({
          user,
          success: true,
          status: "Registration Successful!",
        });
      }
    });
  } else {
    //else send an error message
    res.json("User not found");
  }
});

userRouter.post("/login", passport.authenticate("local"), (req, res) => {
  console.log(req.user._id);
  var token = authenticate.getToken({ _id: req.user._id });
  console.log(token);
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  User.find({ _id: req.user._id }).then((user) => {
    res.json({ user, token: token, status: "You are successfully logged in!" });
  });
});

userRouter.put("/subscribe/:id", (req, res) => {
  console.log(req.body);
  User.findById(req.body.uid).then((user) => {
    if (user) {
      (user.isSubscribed = true),
        user.save().then((user) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(user);
        });
    }
  });
});

userRouter.get("/logout", (req, res) => {
  if (req.session) {
    req.session.destroy();
    res.clearCookie("session-id");
    res.redirect("/");
  } else {
    var err = new Error("You are not logged in!");
    err.status = 403;
    next(err);
  }
});

module.exports = userRouter;

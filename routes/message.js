var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
var Message = require('../models/message');
var passport = require('passport');
var authenticate = require('../authenticate');
const msgRouter = express.Router();

msgRouter.use(express.json());

msgRouter.route('/')
     .post(authenticate.verifyUser,  (req, res, next) => {
        Message.create(req.body).then((msg)=>{
            res.statusCode = 200;
            res.json(msg);
        }), (err) => next(err)
    .catch((err) => next(err));
})

module.exports = msgRouter;
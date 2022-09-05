const nodemailer = require('nodemailer');
const cron = require('node-cron');
var express = require('express');
const app = express();

let mailOptions = {
  from: 'archit10dgp@gmail.com',
  to: 'kaushalbaid16@gmail.com',
  subject: 'Email from Node-App: A Test Message!',
  text: 'Some content to send',
};


let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'archit10dgp@gmail.com',
    pass: 'tnlltppcfspvcuzh',
  },
  tls: {
    rejectUnauthorized: false,
  },
});


  cron.schedule('5 8 * * 0', function () {
    console.log('---------------------');
    console.log('Running Cron Process');
    // Delivering mail with sendMail method
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) console.log(error);
      else console.log('Email sent: ' + info.response);
    });
  });
  
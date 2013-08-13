'use strict';

var sc = module.exports,
    nodemailer = require('nodemailer');

sc.SmtpClient = function() {};

sc.SmtpClient.prototype.send = function() {};

var smtpTransport = nodemailer.createTransport("SMTP", {
    service: "Gmail",
    auth: {
        user: "safewithme.testuser@gmail.com",
        pass: "hellosafe"
    }
});

var mailOptions = {
    from: "Fred Foo ✔ <safewithme.testuser@gmail.com>", // sender address
    to: "safewithme.testuser@gmail.com", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world ✔", // plaintext body
    html: "<b>Hello world ✔</b>" // html body
};

// send mail with defined transport object
smtpTransport.sendMail(mailOptions, function(error, response) {
    if (error) {
        console.log(error);
    } else {
        console.log("Message sent: " + response.message);
    }

    // if you don't want to use this transport object anymore, uncomment following line
    smtpTransport.close(); // shut down the connection pool, no more messages
});


// var simplesmtp = require('simplesmtp');
// var smtpClient = simplesmtp.connect(465, 'smtp.gmail.com', {
//     secureConnection: true,
//     auth: {
//         user: "safewithme.testuser@gmail.com",
//         pass: "hellosafe"
//     }
// });

// smtpClient.once("idle", function() {
//     console.log('idle');
//     smtpClient.close();
// });

// smtpClient.on("error", function(err) {
//     console.log('error', err);
// });

// smtpClient.on("end", function() {
//     console.log('end');
// });
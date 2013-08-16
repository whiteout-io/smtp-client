'use strict';

var nodemailer = require('nodemailer'),
    SmtpClient;

/**
 * SMTP client constructor for the high level smpt api. Creates an SMTP transport object internally
 * @param {String} options.service The name of the email service to user e.g. 'Gmail'
 * @param {String} options.host.auth.user Username for login
 * @param {String} options.host.auth.pass Password for login
 */
SmtpClient = function(options) {
    var self = this;

    //validate options
    if (typeof options.secureConnection === 'undefined' || !options.port || !options.server || !options.auth) {
        throw new Error('Not all options have been specified!');
    }

    self._smtpTransport = nodemailer.createTransport('SMTP', {
        secureConnection: options.secureConnection, // use SSL
        port: options.port,
        host: options.server,
        auth: options.auth
    });
};

/**
 * Send en email using the smtp transport object
 * @param {Object} email An Email object formatted in the email model format
 * @param {function(error, response)} callback invoked after sending is complete
 */
SmtpClient.prototype.send = function(email, callback) {
    var self = this,
        mailOptions;

    mailOptions = {
        from: email.from[0].name + ' <' + email.from[0].address + '>', // sender address
        to: '', // list of receivers
        subject: email.subject, // Subject line
        text: email.body, // plaintext body
        html: undefined // currently only text email bodies are supported
    };

    // add recipient to 'to' and seperate addresses with commas
    email.to.forEach(function(recipient) {
        if (mailOptions.to.length === 0) {
            mailOptions.to += recipient.address;
        } else {
            mailOptions.to += ', ' + recipient.address;
        }
    });

    self._smtpTransport.sendMail(mailOptions, callback);
};

/**
 * Closes the smtp transport object
 */
SmtpClient.prototype.close = function() {
    var self = this;

    self._smtpTransport.close(); // shut down the connection pool, no more messages
};

// export node module
module.exports.SmtpClient = SmtpClient;
// export module into global scope for use in a require.js shim
if (typeof window !== 'undefined') {
    window.SmtpClient = SmtpClient;
}
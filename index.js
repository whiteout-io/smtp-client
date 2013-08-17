'use strict';

var nodemailer = require('nodemailer'),
    SmtpClient;

/**
 * SMTP client constructor for the high level smpt api. Creates an SMTP transport object internally
 * @param {Number} options.port Port is the port to the server (defaults to 25 on non-secure and to 465 on secure connection).
 * @param {String} options.host Hostname of the server.
 * @param {Boolean} options.secure Indicates if the connection is using TLS or not
 * @param {String} options.auth.user Username for login
 * @param {String} options.auth.pass Password for login
 */
SmtpClient = function(options) {
    var self = this;

    //validate options
    if (typeof options.secure === 'undefined' || !options.port || !options.host) {
        throw new Error('Not all options have been specified!');
    }

    self._smtpTransport = nodemailer.createTransport('SMTP', {
        secureConnection: options.secure, // use SSL
        port: options.port,
        host: options.host,
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

/**
 * Export module
 */
if (typeof define !== 'undefined' && define.amd) {
    // AMD
    define(['forge'], function(forge) {
        window.forge = forge;
        return SmtpClient;
    });
} else if (typeof window !== 'undefined') {
    // export module into global scope
    window.SmtpClient = SmtpClient;
} else if (typeof module !== 'undefined' && module.exports) {
    // node.js
    module.exports.SmtpClient = SmtpClient;
}
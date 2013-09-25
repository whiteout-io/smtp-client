if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(function(require) {
    'use strict';

    var nodemailer = require('nodemailer'),
        Buffer = require('node-shims').Buffer.Buffer,
        o = {};

    /**
     * SMTP client constructor for the high level smpt api. Creates an SMTP transport object internally
     * @param {Number} options.port Port is the port to the server (defaults to 25 on non-secure and to 465 on secure connection).
     * @param {String} options.host Hostname of the server.
     * @param {Boolean} options.secure Indicates if the connection is using TLS or not
     * @param {String} options.auth.user Username for login
     * @param {String} options.auth.pass Password for login
     */
    var SmtpClient = o.SmtpClient = function(options, mailer) {
        var self = this;

        //validate options
        if (typeof options.secure === 'undefined' || !options.port || !options.host) {
            throw new Error('Not all options have been specified!');
        }

        self._smtpTransport = (mailer || nodemailer).createTransport('SMTP', {
            secureConnection: options.secure, // use SSL
            port: options.port,
            host: options.host,
            auth: options.auth
        });
    };

    /**
     * Send en email using the smtp transport object
     * @param {Array} email.from Array of sender objects containing name and address
     * @param {Array} email.to Array of receiver objects containing name and address
     * @param {String} email.subject The email subject
     * @param {String} email.body The email body
     * @param {Array} email.attachments Array of attachment objects with fileName as String, uint8Array as Uint8Array, and contentType as String
     * @param {function(error, response)} callback invoked after sending is complete
     */
    SmtpClient.prototype.send = function(email, callback) {
        var self = this,
            mailOptions;

        mailOptions = {
            from: email.from[0].name + ' <' + email.from[0].address + '>', // sender address
            to: '', // list of receivers
            subject: email.subject, // Subject line
            text: email.body // plaintext body
        };

        // add recipient to 'to' and seperate addresses with commas
        email.to.forEach(function(recipient) {
            if (mailOptions.to.length === 0) {
                mailOptions.to += recipient.address;
            } else {
                mailOptions.to += ', ' + recipient.address;
            }
        });

        // convert the Uint8Array to a Buffer
        if (typeof email.attachments !== 'undefined') {
            mailOptions.attachments = [];
            email.attachments.forEach(function(attachment) {
                mailOptions.attachments.push({
                    contents: new Buffer(attachment.uint8Array),
                    fileName: attachment.fileName,
                    contentType: attachment.contentType
                });
            });
        }


        self._smtpTransport.sendMail(mailOptions, callback);
    };

    /**
     * Closes the smtp transport object
     */
    SmtpClient.prototype.close = function() {
        var self = this;

        self._smtpTransport.close(); // shut down the connection pool, no more messages
    };

    return o;
});
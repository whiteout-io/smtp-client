'use strict';

var SmtpClient, loginOptions, dummyMail, expect,
    port = 8686;

if (typeof window === 'undefined') {
    SmtpClient = require('../index');
    expect = require('chai').expect;
} else {
    SmtpClient = window.SmtpClient;
    expect = window.chai.expect;
}

function str2arr(str) {
    var buf = new ArrayBuffer(str.length);
    var bufView = new Uint8Array(buf);
    for (var i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return bufView;
}

dummyMail = {
    from: [{
        name: 'Whiteout Test',
        address: 'whiteout.test@t-online.de'
    }], // sender address
    to: [{
        address: 'safewithme.testuser@gmail.com'
    }], // list of receivers
    subject: "Hello", // Subject line
    body: "Hello world", // plaintext body
    attachments: [{
        fileName: 'foo.txt',
        contentType: 'text/plain',
        uint8Array: str2arr('foofoofoofoofoo')
    }, {
        fileName: 'bar.txt',
        contentType: 'text/plain',
        uint8Array: str2arr('barbarbarbarbar')
    }]
};

describe('SmtpClient local integration tests', function() {
    var sc;

    afterEach(function() {
        sc.close();
    });

    describe('SmtpClient.send to localhost', function() {
        it('should send an email', function(done) {
            // start local test smtp server
            createSTMPServer();

            loginOptions = {
                secure: false, // use SSL
                port: port,
                host: 'localhost'
            };

            sc = new SmtpClient(loginOptions);
            sc.send(dummyMail, function(error, response) {
                expect(error).to.not.exist;
                expect(response.message).to.exist;
                expect(response.messageId).to.exist;
                done();
            });
        });
    });

});

//
// Test Server Setup
//

function createSTMPServer() {
    var smtp = require('simplesmtp').createServer(),
        MailParser = require('mailparser').MailParser;

    smtp.on('startData', function(connection) {
        connection.saveStream = new MailParser();
    });

    smtp.on('data', function(connection, chunk) {
        connection.saveStream.write(chunk);
    });

    smtp.on('dataReady', function(connection, callback) {
        // generate unique ID for the email
        var mailId = '12345';
        connection.saveStream.on('end', function(mail) {
            // check incoming email
            if (mail.to && mail.from && mail.subject && (mail.html || mail.text)) {
                callback(null, mailId); // the queue id to be advertised to the client
            } else {
                var errMsg = 'Error handling incoming mail with ID: ' + mailId;
                callback(new Error(errMsg)); // reported error back to the client
            }
        });

        connection.saveStream.end();
    });

    smtp.listen(port);
}
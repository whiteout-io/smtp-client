'use strict';

var SmtpClient, loginOptions, dummyMail, expect;

if (typeof window === 'undefined') {
    SmtpClient = require('../index').SmtpClient;
    expect = require('chai').expect;
} else {
    SmtpClient = window.SmtpClient;
    expect = window.chai.expect;
}

dummyMail = {
    from: [{
        name: 'Fred Foo',
        address: 'safewithme.testuser@gmail.com'
    }], // sender address
    to: [{
        address: 'safewithme.testuser@gmail.com'
    }], // list of receivers
    subject: "Hello", // Subject line
    body: "Hello world" // plaintext body
};

describe('SmtpClient integration tests', function() {
    this.timeout(20000);

    var sc;

    afterEach(function() {
        sc.close();
    });

    describe('SmtpClient.send without TLS', function() {
        it('should send an email', function(done) {
            loginOptions = {
                secure: false, // use SSL
                port: 25,
                host: 'smtpmail.t-online.de',
                auth: {
                    user: "whiteout.test@t-online.de",
                    pass: "@6IyFg1SIlWH91Co"
                }
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

    describe('SmtpClient.send with TLS', function() {
        it('should send an email', function(done) {
            loginOptions = {
                secure: true, // use SSL
                port: 465,
                host: 'smtp.gmail.com',
                auth: {
                    user: "safewithme.testuser@gmail.com",
                    pass: "hellosafe"
                }
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
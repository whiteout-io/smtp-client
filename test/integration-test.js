'use strict';

var SmtpClient, loginOptions, dummyMail, expect;

if (typeof window === 'undefined') {
    SmtpClient = require('../index').SmtpClient;
    expect = require('chai').expect;
} else {
    SmtpClient = window.SmtpClient;
    expect = window.chai.expect;
}

loginOptions = {
    service: "Gmail",
    auth: {
        user: "safewithme.testuser@gmail.com",
        pass: "hellosafe"
    }
};

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

    beforeEach(function() {
        sc = new SmtpClient(loginOptions);
    });

    afterEach(function() {
        sc.close();
    });

    describe('SmtpClient.send', function() {
        it('should send an email', function(done) {
            sc.send(dummyMail, function(error, response) {
                expect(error).to.not.exist;
                expect(response.message).to.exist;
                done();
            });
        });
    });
});
'use strict';

var rewire = require('rewire'),
    expect = require('chai').expect,
    nodemailer = require('nodemailer'),
    smtpClient = rewire('../index'),
    JsMockito = require('jsmockito').JsMockito,
    JsHamcrest = require('jshamcrest').JsHamcrest,
    nodemailerMock, smtpTransportMock, loginOptions, dummyMail;

JsMockito.Integration.Nodeunit();
JsHamcrest.Integration.Nodeunit();

//
// Mocking
//

smtpTransportMock = {
    sendMail: function(mailOptions, callback) {
        if (!mailOptions || !mailOptions.to || !mailOptions.from) {
            callback({
                err: 'mailOptions not specified!'
            });
            return;
        }

        expect(arr2str(mailOptions.attachments[0].contents)).to.equal('foofoofoofoofoo');
        expect(arr2str(mailOptions.attachments[1].contents)).to.equal('barbarbarbarbar');

        callback(null, {
            message: "250 2.0.0 Message accepted.",
            messageId: "1376645980390.0de95471@Nodemailer"
        });
    },
    close: function() {}
};

nodemailerMock = mock(nodemailer);
when(nodemailerMock).createTransport('SMTP', anything()).thenReturn(smtpTransportMock);

smtpClient.__set__({
    nodemailer: nodemailerMock
});

function str2arr(str) {
    var buf = new ArrayBuffer(str.length);
    var bufView = new Uint8Array(buf);
    for (var i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return bufView;
}

function arr2str(arr) {
    return String.fromCharCode.apply(null, arr);
}

//
// Test data
//

loginOptions = {
    secure: false, // use SSL
    port: 25,
    host: 'smtpmail.t-online.de',
    auth: {
        user: "whiteout.test@t-online.de",
        pass: "@6IyFg1SIlWH91Co"
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

//
// Test fixtures
//

describe('SmptClient unit tests', function() {
    describe('initialize with user and password', function() {
        it('should initialize', function() {
            var client = new smtpClient.SmtpClient(loginOptions);
            expect(client._smtpTransport).to.equal(smtpTransportMock);
        });
    });
});

describe('SmptClient unit tests', function() {
    var client;

    beforeEach(function() {
        client = new smtpClient.SmtpClient(loginOptions);
        expect(client._smtpTransport).to.equal(smtpTransportMock);
    });

    afterEach(function() {
        client.close();
    });

    describe('send email', function() {
        it('should return without error', function(done) {
            client.send(dummyMail, function(error, response) {
                expect(error).to.not.exist;
                expect(response.message).to.exist;
                expect(response.messageId).to.exist;
                done();
            });
        });
    });
});
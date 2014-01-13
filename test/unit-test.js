if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(function(require) {
    'use strict';

    var expect = require('chai').expect,
        sinon = require('sinon'),
        nodemailer = require('nodemailer'),
        SmtpClient = require('..'),
        Dummy;

    // the internal call structure of nodemailer is pretty fubar,
    // so i will take this shortcut instead of mocking the actual calls
    Dummy = function() {};
    Dummy.prototype.sendMail = function() {};

    describe('SmptClient unit tests', function() {
        var client, secureClient, transportMock;

        beforeEach(function() {
            var createTransportStub, mockCert = 'asd';

            transportMock = sinon.createStubInstance(Dummy);
            createTransportStub = sinon.stub(nodemailer, 'createTransport', function() {
                return transportMock;
            });

            client = new SmtpClient({
                secure: false, // use SSL
                port: 25,
                host: 'smtpmail.t-online.de',
                auth: {
                    user: "whiteout.test@t-online.de",
                    pass: "@6IyFg1SIlWH91Co"
                }
            }, nodemailer);

            secureClient = new SmtpClient({
                secure: true, // use SSL
                port: 25,
                host: 'smtpmail.t-online.de',
                auth: {
                    user: "whiteout.test@t-online.de",
                    pass: "@6IyFg1SIlWH91Co"
                },
                ca: [mockCert]
            }, nodemailer);



            expect(client).to.exist;
            expect(client._smtpTransport).to.equal(transportMock);
            expect(createTransportStub.calledTwice).to.be.true;
            expect(createTransportStub.getCall(0).calledWith('SMTP', sinon.match(function(o) {
                return o.secureConnection === false;
            }))).to.be.true;
            expect(createTransportStub.getCall(1).calledWith('SMTP', sinon.match(function(o) {
                return o.secureConnection === true && o.tls.ca[0] === mockCert;
            }))).to.be.true;
        });

        afterEach(function() {
            nodemailer.createTransport.restore();
        });

        it('should send email without error', function(done) {
            var dummyMail = {
                from: [{
                    name: 'Fred Foo',
                    address: 'safewithme.testuser@gmail.com'
                }], // sender address
                to: [{
                    address: 'safewithme.testuser@gmail.com'
                }], // list of to
                cc: [{
                    address: 'safewithme.testuser@gmail.com'
                }], // list of cc
                bcc: [{
                    address: 'safewithme.testuser@gmail.com'
                }], // list of bcc
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

            var mailMatcher = sinon.match(function(mail) {
                expect(mail).to.exist;
                expect(mail.from).to.not.be.instanceof(Array);
                expect(mail.to).to.be.instanceof(Array);
                expect(mail.subject).to.equal('Hello');
                expect(arr2str(mail.attachments[0].contents)).to.equal('foofoofoofoofoo');
                expect(arr2str(mail.attachments[1].contents)).to.equal('barbarbarbarbar');

                return true;
            });

            transportMock.sendMail.yields(null, {
                message: "250 2.0.0 Message accepted.",
                messageId: "1376645980390.0de95471@Nodemailer"
            });

            client.send(dummyMail, function(error, response) {
                expect(error).to.not.exist;
                expect(response.message).to.exist;
                expect(response.messageId).to.exist;
                expect(transportMock.sendMail.calledOnce).to.be.true;
                sinon.assert.calledWith(transportMock.sendMail, mailMatcher, sinon.match.any);

                done();
            });
        });

        it('should error while sending mail', function(done) {
            var dummyMail = {
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

            transportMock.sendMail.yields(new Error('fubar!'));

            client.send(dummyMail, function(error, response) {
                expect(error).to.exist;
                expect(response).to.not.exist;
                expect(transportMock.sendMail.calledOnce).to.be.true;

                done();
            });
        });
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
});
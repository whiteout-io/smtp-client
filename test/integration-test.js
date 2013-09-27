if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(function(require) {
    'use strict';

    var SmtpClient = require('smtp-client'),
        expect = require('chai').expect,
        dummyMail, attachments;

    attachments = [{
        fileName: 'foo.txt',
        contentType: 'text/plain',
        uint8Array: str2arr('foofoofoofoofoo')
    }, {
        fileName: 'bar.txt',
        contentType: 'text/plain',
        uint8Array: str2arr('barbarbarbarbar')
    }],
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
        /*attachments: attachments*/
    };

    describe('SmtpClient integration tests', function() {
        this.timeout(20000);

        var sc;

        afterEach(function() {
            sc.close();
        });

        describe('SmtpClient.send with T-mobile without TLS', function() {
            it('should send an email', function(done) {
                var loginOptions = {
                    secure: false, // use SSL
                    port: 25,
                    host: 'smtpmail.t-online.de',
                    auth: {
                        user: "whiteout.test@t-online.de",
                        pass: "@6IyFg1SIlWH91Co" // 'R2nUXJlh9JKV3ZEp1#jH'
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

        // describe('SmtpClient.send with T-mobile over TLS', function() {
        //     it('should send an email', function(done) {
        //         var loginOptions = {
        //             secure: true, // use SSL
        //             port: 465,
        //             host: 'securesmtp.t-online.de',
        //             auth: {
        //                 user: "whiteout.test@t-online.de",
        //                 pass: "@6IyFg1SIlWH91Co"
        //             }
        //         };

        //         sc = new SmtpClient(loginOptions);
        //         sc.send(dummyMail, function(error, response) {
        //             expect(error).to.not.exist;
        //             expect(response.message).to.exist;
        //             expect(response.messageId).to.exist;
        //             done();
        //         });
        //     });
        // });

        describe('SmtpClient.send with Gmail over TLS', function() {
            it('should send an email', function(done) {
                var loginOptions = {
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

    function str2arr(str) {
        var buf = new ArrayBuffer(str.length);
        var bufView = new Uint8Array(buf);
        for (var i = 0, strLen = str.length; i < strLen; i++) {
            bufView[i] = str.charCodeAt(i);
        }
        return bufView;
    }
});
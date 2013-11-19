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
        attachments: attachments
    };

    describe('SmtpClient integration tests', function() {
        this.timeout(20000);

        var sc;

        afterEach(function() {
            sc.close();
        });

        describe('SmtpClient.send with T-online without TLS', function() {
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

        // describe('SmtpClient.send with T-online over TLS', function() {
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
                    },
                    ca: ['-----BEGIN CERTIFICATE-----\r\nMIIEBDCCAuygAwIBAgIDAjppMA0GCSqGSIb3DQEBBQUAMEIxCzAJBgNVBAYTAlVT\r\nMRYwFAYDVQQKEw1HZW9UcnVzdCBJbmMuMRswGQYDVQQDExJHZW9UcnVzdCBHbG9i\r\nYWwgQ0EwHhcNMTMwNDA1MTUxNTU1WhcNMTUwNDA0MTUxNTU1WjBJMQswCQYDVQQG\r\nEwJVUzETMBEGA1UEChMKR29vZ2xlIEluYzElMCMGA1UEAxMcR29vZ2xlIEludGVy\r\nbmV0IEF1dGhvcml0eSBHMjCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEB\r\nAJwqBHdc2FCROgajguDYUEi8iT/xGXAaiEZ+4I/F8YnOIe5a/mENtzJEiaB0C1NP\r\nVaTOgmKV7utZX8bhBYASxF6UP7xbSDj0U/ck5vuR6RXEz/RTDfRK/J9U3n2+oGtv\r\nh8DQUB8oMANA2ghzUWx//zo8pzcGjr1LEQTrfSTe5vn8MXH7lNVg8y5Kr0LSy+rE\r\nahqyzFPdFUuLH8gZYR/Nnag+YyuENWllhMgZxUYi+FOVvuOAShDGKuy6lyARxzmZ\r\nEASg8GF6lSWMTlJ14rbtCMoU/M4iarNOz0YDl5cDfsCx3nuvRTPPuj5xt970JSXC\r\nDTWJnZ37DhF5iR43xa+OcmkCAwEAAaOB+zCB+DAfBgNVHSMEGDAWgBTAephojYn7\r\nqwVkDBF9qn1luMrMTjAdBgNVHQ4EFgQUSt0GFhu89mi1dvWBtrtiGrpagS8wEgYD\r\nVR0TAQH/BAgwBgEB/wIBADAOBgNVHQ8BAf8EBAMCAQYwOgYDVR0fBDMwMTAvoC2g\r\nK4YpaHR0cDovL2NybC5nZW90cnVzdC5jb20vY3Jscy9ndGdsb2JhbC5jcmwwPQYI\r\nKwYBBQUHAQEEMTAvMC0GCCsGAQUFBzABhiFodHRwOi8vZ3RnbG9iYWwtb2NzcC5n\r\nZW90cnVzdC5jb20wFwYDVR0gBBAwDjAMBgorBgEEAdZ5AgUBMA0GCSqGSIb3DQEB\r\nBQUAA4IBAQA21waAESetKhSbOHezI6B1WLuxfoNCunLaHtiONgaX4PCVOzf9G0JY\r\n/iLIa704XtE7JW4S615ndkZAkNoUyHgN7ZVm2o6Gb4ChulYylYbc3GrKBIxbf/a/\r\nzG+FA1jDaFETzf3I93k9mTXwVqO94FntT0QJo544evZG0R0SnU++0ED8Vf4GXjza\r\nHFa9llF7b1cq26KqltyMdMKVvvBulRP/F/A8rLIQjcxz++iPAsbw+zOzlTvjwsto\r\nWHPbqCRiOwY1nQ2pM714A5AuTHhdUDqB1O6gyHA43LL5Z/qHQF1hwFGPa4NrzQU6\r\nyuGnBXj8ytqU0CwIPX4WecigUCAkVDNx\r\n-----END CERTIFICATE-----\r\n']
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
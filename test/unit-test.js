'use strict';

var rewire = require('rewire'),
    expect = require('chai').expect,
    nodemailer = require('nodemailer'),
    smtpClient = rewire('../index'),
    JsMockito = require('jsmockito').JsMockito,
    JsHamcrest = require('jshamcrest').JsHamcrest,
    nmMock, loginOptions, dummyMail;

JsMockito.Integration.Nodeunit();
JsHamcrest.Integration.Nodeunit();

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
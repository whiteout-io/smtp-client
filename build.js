'use strict';

var browserify = require('browserify'),
    fs = require('fs'),
    path = require('path');

var b = browserify('./index.js');
b.require('./src/fs-dummy', {
    expose: 'fs'
});
b.require('./src/iconv-dummy', {
    expose: 'iconv'
});
b.require('./src/module-dummy', {
    expose: 'os'
});
b.require('./src/module-dummy', {
    expose: 'dns'
});
b.require('net-chromeify', {
    expose: 'net'
});
b.require('tls-chromeify', {
    expose: 'tls'
});

b.bundle(function(err, src) {
    var dirName,
        fileName,
        file;

    if (err) {
        throw err;
    }

    dirName = 'src-gen';
    fileName = 'smtp-client-browserified.js';

    // create dir if not existant
    try {
        fs.mkdirSync(path.join(__dirname, dirName));
    } catch (e) {}

    file = path.join(__dirname, dirName, fileName);
    fs.writeFileSync(file, src);

    console.log('bundle written to: ' + file);
});
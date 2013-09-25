require.config({
    baseUrl: '../lib',
    paths: {
        'test': '..',
        'node-forge': 'forge',
        'setimmediate': 'setImmediate'
    }
});

require([], function() {
    'use strict';

    mocha.setup('bdd');

    require(['test/integration-test'], function() {
        mocha.run();
        mocha.checkLeaks();
    });
});
module.exports = function(grunt) {
    'use strict';

    // Project configuration.
    grunt.initConfig({
        jshint: {
            all: ['*.js', 'src/*.js', 'test/*-test.js', 'test/background.js'],
            options: {
                jshintrc: '.jshintrc'
            }
        },
        mochaTest: {
            test: {
                options: {
                    reporter: 'spec'
                },
                src: ['test/unit-test.js']
            }
        },
        watch: {
            unit: {
                files: ['test/unit-test.js'],
                tasks: ['unit']
            },
            // integration: {
            //     files: ['test/integration-test.js', 'test/browser-test.js'],
            //     tasks: ['integration']
            // },
            js: {
                files: ['src/*.js'],
                tasks: ['unit']
            }
        },
        copy: {
            npm: {
                expand: true,
                flatten: true,
                cwd: 'node_modules/',
                src: [
                    'chai/chai.js',
                    'mocha/mocha.js',
                    'mocha/mocha.css',
                    'requirejs/require.js',
                ],
                dest: 'test/lib/'
            },
            app: {
                expand: true,
                flatten: true,
                cwd: 'src/',
                src: [
                    '*.js',
                ],
                dest: 'test/lib/'
            }
        },
        clean: {
            test: ['test/lib/']
        }
    });

    // Load the plugin(s)
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');

    // Default task(s).
    grunt.registerTask('unit', ['jshint', 'mochaTest']);
    grunt.registerTask('integration', ['jshint', 'clean:test', 'copy']);
    grunt.registerTask('default', ['jshint', 'mochaTest', 'clean:test', 'copy']);
};

const _VERSION_ = require('./package').version;

function makeBrowserifyTask (src, dest, standalone, dev) {
    'use strict';
    let task = {
        src: src,
        dest: dest,
        options: {
            transform: ['babelify'],
            plugin: [
              ['browserify-derequire']
            ],
            browserifyOptions: {
                debug: dev,
                standalone: standalone
            },
            watch: dev,
            keepAlive: dev
        }
    };
    if (!dev) {
        task.options.transform.push(['uglifyify', {
                global: true,
                compress: {
                    drop_console: !dev,
                    global_defs: {
                        _VERSION_,
                    }
                }
        }]);
    }
    return task;
}

/*global module:false*/
module.exports = function (grunt) {

    //Load NPM tasks for dependencies
    require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);
    // Project configuration.
    grunt.initConfig({
        // Metadata.
        pkg: grunt.file.readJSON('package.json'),
        version: '<%= pkg.version %>',
        file_version: '',

        /* Compile & watch */
        browserify: {
            test_dev: makeBrowserifyTask("test/html/tests.js",
                                    "test/html/build.js",
                                    "Tests",
                                    true),
            test: makeBrowserifyTask("test/html/tests.js",
                                    "test/html/build.js",
                                    "Tests",
                                    false)

        }
    });

};

module.exports = function(grunt) {

    "use strict";

    grunt.file.defaultEncoding = "utf8";

    var autoprefixer = require('autoprefixer-core');
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        less: {
            main:{
                files: {                  
                    'build/css/bootstrap.css': 'src/less/bootstrap/bootstrap.less',
                    'build/css/login.css': 'src/less/login.less',
                   "build/css/main.css": "src/less/main/main.less",
                   "build/css/lmc.css": "src/less/basic.less"
                }
            }
        },
        postcss: {
            options: {
                processors: [
                    autoprefixer({ browsers: ['> 5%'] })
                ]
            },
            dist: { src: 'build/css/*.css' }
        },

        cssmin: {
            bootstrap: {
                src: 'build/css/bootstrap.css',
                dest: 'build/css/bootstrap.min.css'
            },
            login: {
                src: 'build/css/login.css',
                dest: 'build/css/login.min.css'
            },
            main: {
                src: 'build/css/main.css',
                dest: 'build/css/main.min.css'
            },
            npc: {
                src: 'build/css/lmc.css',
                dest: 'build/css/lmc.min.css'
            }
            
        },
        uglify: {
            h5editor: {
                options: {
                    mangle: true, //混淆变量名
                    preserveComments: 'false' //不删除注释，还可以为 false（删除全部注释），some（保留@preserve @license @cc_on等注释）
                },
                files: {
                    'app/directives/ui-bootstrap.js': ['src/js/ui-bootstrap-tpls-1.1.0.js']
                }
            },
        },
        copy: {
            app_font: {
                dest: 'app/fonts/',
                expand: true,
                cwd: 'src/fonts/',
                src: '**',
                flatten: true,
            },            
            app_core: {
                cwd: 'build/css/',
                src: '**',
                dest: 'app/css/',
                expand: true,
                flatten: true
            }
        }
    });
    grunt.registerTask('default', [ 'less', 'postcss', 'cssmin','uglify', 'copy']);

};
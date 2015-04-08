/**
 * Created by Mike Dvorscak on 4/4/15.
 */
'use strict';
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var header = require('gulp-header');
//Test libs
var karma = require('karma').server;
var jasmine = require('gulp-jasmine');
var istanbul = require('gulp-istanbul');
var lcovMerger = require('lcov-result-merger');

gulp.task('browser-test', function (done) {
    karma.start({
        configFile: __dirname + '/karma.conf.js',
        singleRun : true
    }, done);
});

gulp.task('build-node-test', function () {
    return gulp.src('test/main.js')
        .pipe(header("var cloak = require('../cloak.js');"))
        .pipe(rename({
                  extname: '-node.js'
              }))
        .pipe(gulp.dest('test/'));
    ;
});

gulp.task('node-test', ['build-node-test'], function (done) {
    gulp.src('cloak.js')
        .pipe(istanbul())
        .pipe(istanbul.hookRequire())
        .on('finish', function () {
                gulp.src('test/*-node.js')
                    .pipe(jasmine())
                    .pipe(istanbul.writeReports({
                                             dir: './coverage/node'
                                          }))
                    .on('end', done);
            });
});

gulp.task('test', ['browser-test', 'node-test'], function(){
    return gulp.src('coverage/**/lcov.info')
        .pipe(lcovMerger())
        .pipe(rename({
                  extname: '-merged.info'
              }))
        .pipe(gulp.dest('coverage'));
});

gulp.task('tdd', function (done) {
    karma.start({
        configFile: __dirname + '/karma.conf.js'
    }, done);
});

gulp.task('scripts', function () {
    return gulp.src('cloak.js')
        .pipe(uglify())
        .pipe(rename({
                  extname: '.min.js'
              }))
        .pipe(gulp.dest(''));
});

gulp.task('dev', ['tdd'], function () {
    gulp.watch('cloak.js', ['scripts']);
});

gulp.task('default', ['test', 'scripts']);
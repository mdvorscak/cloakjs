/**
 * Created by Mike Dvorscak on 4/4/15.
 */
'use strict';
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var karma = require('karma').server;

gulp.task('test', function (done) {
    karma.start({
        configFile: __dirname + '/karma.conf.js',
        singleRun : true
    }, done);
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

gulp.task('default', ['test', 'scripts']);
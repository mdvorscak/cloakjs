/**
 * Created by Mike Dvorscak on 4/4/15.
 */
var gulp = require('gulp');
var karma = require('karma').server;

gulp.task('test', function(done){
    karma.start({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, done);
});

gulp.task('tdd', function(done){
    karma.start({
        configFile: __dirname + '/karma.conf.js'
    }, done);
});
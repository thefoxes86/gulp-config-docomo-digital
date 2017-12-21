var gulp = require('gulp');
var removecode = require('gulp-remove-code');
var replace = require('gulp-replace');
var ejs = require('gulp-ejs');
var rename = require('gulp-rename');
var webserver = require('gulp-webserver');
var sequence = require('gulp-sequence');

var base = require('./base');

gulp.task('dist:single', ['loadconfig', 'loaddict', 'loadfooter', 'less'], function () {
    base.config.JS_BUILD_URL = '/dist/';
    gulp.src('dist/' + base.config.JS_INDEX_PAGE)
        .pipe(removecode({ stage: true }))
        .pipe(replace('<TMPL_VAR NAME=CONFIG>', JSON.stringify(base.config)))
        .pipe(replace('<TMPL_VAR NAME=DICTIONARY>', JSON.stringify(base.dictionary)))
        .pipe(replace('<TMPL_VAR NAME=FOOTER_LINKS>', JSON.stringify(base.footer)))
        .pipe(replace(/<TMPL_VAR NAME="?'?(.*?)"?'? ESCAPE=AS_JSON>/gim, '<%- JSON.stringify(config.$1) %>'))
        .pipe(replace(/<TMPL_VAR NAME="?'?(.*?)"?'?>/gim, '<%= config.$1 %>'))
        .pipe(replace(/<TMPL_IF NAME="?'?(.*?)"?'?>/gim, '<% if (config.$1) { %>'))
        .pipe(replace(/<TMPL_UNLESS NAME="?'?(.*?)"?'?>/gim, '<% if (!config.$1) { %>'))
        .pipe(replace(/<TMPL_ELSE>/gim, '<% } else { %>'))
        .pipe(replace(/<\/TMPL_IF>/gim, '<% } %>'))
        .pipe(replace(/<\/TMPL_UNLESS>/gim, '<% } %>'))
        .pipe(replace(/<\/TMPL_ELSE>/gim, '<% } %>'))
        .pipe(ejs({ config: base.config }))
        .pipe(rename('index-stage.html'))
        .pipe(gulp.dest('dist/'));
});

gulp.task('dist:copy', function () {
    gulp.src('./app/app-stage.css').pipe(gulp.dest('dist/'));
});

gulp.task('dist:server', ['loadconfig'], function () {
    gulp.src('.').pipe(webserver({
        port: 3000,
        open: base.settings.stageURL + '/dist/index-stage.html'
    }));
});

gulp.task('dist', sequence('dist:single', 'dist:copy', 'dist:server'));
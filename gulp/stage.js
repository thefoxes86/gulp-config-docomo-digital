var gulp = require('gulp');
var removecode = require('gulp-remove-code');
var replace = require('gulp-replace');
var ejs = require('gulp-ejs');
var rename = require('gulp-rename');
var webserver = require('gulp-webserver');

var conf = require('./conf');

gulp.task('stage:single', ['loadconfig', 'loaddict', 'loadfooter'], function(){
    gulp.src('app/' + conf.indexPage)
    .pipe(removecode({ stage: true }))
    .pipe(replace('node_modules/', '../node_modules/'))
    .pipe(replace('<TMPL_VAR NAME=CONFIG>', JSON.stringify(conf.vhost)))
    .pipe(replace('<TMPL_VAR NAME=DICTIONARY>', JSON.stringify(conf.dict)))
    .pipe(replace('<TMPL_VAR NAME=FOOTER_LINKS>', JSON.stringify(conf.footer)))
    .pipe(replace(/<TMPL_VAR NAME="?'?(.*?)"?'?>/gim, '<%= config.$1 %>'))
    .pipe(replace(/<TMPL_IF NAME="?'?(.*?)"?'?>/gim, '<% if (config.$1) { %>'))
    .pipe(replace(/<TMPL_UNLESS NAME="?'?(.*?)"?'?>/gim, '<% if (!config.$1) { %>'))
    .pipe(replace(/<TMPL_ELSE>/gim, '<% } else { %>'))
    .pipe(replace(/<\/TMPL_IF>/gim, '<% } %>'))
    .pipe(replace(/<\/TMPL_UNLESS>/gim, '<% } %>'))    
    .pipe(replace(/<\/TMPL_ELSE>/gim, '<% } %>'))
    .pipe(ejs({ config: conf.vhost }))
    .pipe(rename('index-stage.html'))
    .pipe(gulp.dest('app/'));
});

gulp.task('stage', ['stage:single'], function(){
    gulp.src('.')
    .pipe(webserver({
        port: 3000,
        open: conf.customConfig.stageURL + '/app/index-stage.html',
        proxies: {
            source: '/js/wl/webstore_news/app/',
            target: '/app'
        }
    }));
    gulp.watch(['app/' + conf.indexPage, '../css/**/*.*', 'custom.json'], ['stage:single']);
});
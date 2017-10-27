var gulp = require('gulp');
var del = require('del');
var lineReader = require('readline');
var fs = require('fs');
var less = require('gulp-less');
var replace = require('gulp-replace');
var rename = require('gulp-rename');
var insert = require('gulp-insert');

var base = require('./base');

gulp.task('less:clean', ['loadconfig'], function(done){
    del([
        'app/app-stage.css',
        '../css/gulp/constants_images.less'
    ], { force: true }).then(function(){ done(); });
});

gulp.task('less:constantsImages', ['less:clean'], function(done){
    var buffer = '// CREATED BY GULP, DON\'T COMMIT OR EDIT THIS FILE \n';
    lineReader.createInterface({
        input: fs.createReadStream(process.cwd() + '/../css/constants_images.conf')
    }).on('line', function(line) {
        if(line !== '' && line.indexOf('{') === -1 && line.indexOf('}') === -1){
            buffer += line
                .replace(/ :/gim, ':')
                .replace(/: /gim, ':')
                .replace(/":/gim, ':')
                .replace(/    /gim, '\t')
                .replace(/\t"/gim, '@')
                .replace(/:"/gim, ':"' + base.settings.imagePrefix)
                .replace(/",/gim, '"')
                .trim();
            buffer += ';';
            buffer += '\n';
        }        
    }).on('close', function(){
        fs.writeFile(process.cwd() + '/../css/gulp/constants_images.less', buffer, function(err) {
            if(err) { throw err; }
            done();
        });
    });
});

gulp.task('less', ['less:constantsImages'], function(){
    gulp.src('../css/' + base.config.LESS_CSS_NAME)
    .pipe(replace(/@import 'custom_css.conf'/gim, ''))
    .pipe(replace(/@import '@{bower_import}'/gim, ''))
    .pipe(insert.prepend('@import \'./gulp/constants_images.less\'; \n\n'))
    .pipe(insert.append('\n\n @import \'./gulp/local.less\';'))
    .pipe(rename('app-stage.less'))
    .pipe(less())
    .pipe(gulp.dest('app/'));
});
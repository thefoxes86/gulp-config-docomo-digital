var gulp = require('gulp');
var styleguide = require('sc5-styleguide');
var webserver = require('gulp-webserver');

var base = require('./base');

gulp.task('style:generate', ['less'], function() {
    return gulp.src(['../css/**/*.less', '!../css/mixins/*.less'])
        .pipe(styleguide.generate({
            title: 'Styleguide',
            server: false,
            overviewPath: 'README.md',
            sideNav: false,
            disableHtml5Mode: true
        }))
        .pipe(gulp.dest('styleguide/' + base.config.LESS_CSS_NAME));
});

gulp.task('style:applystyles', ['less'], function() {
    return gulp.src(['app/app-stage.css'])
        .pipe(styleguide.applyStyles())
        .pipe(gulp.dest('styleguide/' + base.config.LESS_CSS_NAME));
});

gulp.task('style', ['style:generate', 'style:applystyles'], function(){
    gulp.src('./styleguide/' + base.config.LESS_CSS_NAME)
    .pipe(webserver({
        port: 5000,
        open: '/'
    }));
    gulp.watch(['../css/**/*'], ['style']);
}); 
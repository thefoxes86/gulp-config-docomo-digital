var gulp = require('gulp');
var styleguide = require('sc5-styleguide');
var webserver = require('gulp-webserver');

var base = require('./base');

gulp.task('style:generate', ['less'], function() {
    return gulp.src(base.settings.styleguideSrc)
        .pipe(styleguide.generate({
            title: 'Styleguide',
            server: false,
            overviewPath: 'README.md',
            sideNav: false,
            disableHtml5Mode: true,
            appRoot: '/styleguide/' + base.settings.fwName + '/' + base.config.LESS_CSS_NAME
        }))
        .pipe(gulp.dest('styleguide/' + base.config.LESS_CSS_NAME));
});

gulp.task('style:applystyles', ['style:generate'], function() {
    return gulp.src('app/app-stage.css')
        .pipe(styleguide.applyStyles())
        .pipe(gulp.dest('styleguide/' + base.config.LESS_CSS_NAME));
});

gulp.task('style', ['style:applystyles'], function(){
    gulp.src('.')
    .pipe(webserver({
        port: 5000,
        open: '/styleguide/' + base.settings.fwName + '/' + base.config.LESS_CSS_NAME,
        proxies: [{
            source: '/styleguide/' + base.settings.fwName + '/',
            target: 'http://localhost:5000/styleguide/'
        }]
    }));
    gulp.watch(['../css/**/*'], ['style']);
}); 
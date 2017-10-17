var gulp = require('gulp');
var eslint = require('gulp-eslint');

gulp.task('lint', function(){
    return gulp.src([
        'app/**/*.js', 
        '!app/bower_components/**/*.js'
    ])
    .pipe(eslint({
        quiet: true
    }))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});
var gulp = require('gulp');
var lec = require('gulp-line-ending-corrector');

gulp.task('crtolf', function(){
    return gulp.src('app/**/*.*')
    .pipe(lec({ 
        verbose: true, 
        eolc: 'LF', 
        encoding: 'utf8' 
    }))
    .pipe(gulp.dest('app/'));
});
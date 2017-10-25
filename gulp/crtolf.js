var gulp = require('gulp');
var lec = require('gulp-line-ending-corrector');

gulp.task('crtolf:css', function(){
    return gulp.src('../css/**/*.*')
    .pipe(lec({ 
        verbose: true, 
        eolc: 'LF', 
        encoding: 'utf8' 
    }))
    .pipe(gulp.dest('../css/'));
});

gulp.task('crtolf:app', function(){
    return gulp.src('app/**/*.*')
    .pipe(lec({ 
        verbose: true, 
        eolc: 'LF', 
        encoding: 'utf8' 
    }))
    .pipe(gulp.dest('app/'));
});

gulp.task('crtolf', ['crtolf:css', 'crtolf:app']);
var gulp = require('gulp');
var eslint = require('gulp-eslint');
var argv = require('yargs').argv;

function isFixed(file) {
	return file.eslint != null && file.eslint.fixed;
}

gulp.task('lint', function(){
    if(argv.fix){
        return gulp.src('app/**/*.js')
        .pipe(eslint({
            fix: true,
            quiet: true
        }))
        .pipe(eslint.format())
        .pipe(gulpIf(isFixed, gulp.dest('app')));
    } else {
        return gulp.src('app/**/*.js')
        .pipe(eslint({
            quiet: true
        }))
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
    }    
});
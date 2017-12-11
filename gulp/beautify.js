var gulp = require('gulp');
var beautify = require('gulp-beautify');

gulp.task('beautify', function() {
    return gulp.src('app/**/*.js')
    .pipe(beautify())
    .pipe(gulp.dest('app'))
});
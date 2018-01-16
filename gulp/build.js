var gulp = require('gulp');
var del = require('del');
var ngTemplate = require('gulp-ng-templates');
var filter = require('gulp-filter');
var replace = require('gulp-replace');
var useref = require('gulp-useref');
var removecode = require('gulp-remove-code');
var cleanCSS = require('gulp-clean-css');
var sourcemaps = require('gulp-sourcemaps');
var ngAnnotate = require('gulp-ng-annotate');
var uglify = require('gulp-uglify');
var rev = require('gulp-rev');
var revReplace = require('gulp-rev-replace');
var lec = require('gulp-line-ending-corrector');
var gulpif = require('gulp-if');
var sequence = require('gulp-sequence');
var babel = require('gulp-babel');

var base = require('./base');

gulp.task('build:clean', ['lint'], function(done){
    del(['dist/**/*.*'], { force: true }).then(function(){ done(); });
});

gulp.task('build:html', ['build:clean', 'loadcustom'], function(){
    if(base.settings.mergeHtml){
        return gulp.src(['app/**/*.html', '!app/index*.html'])
        .pipe(ngTemplate({
            module: base.settings.mainAngularModule,
            standalone: false,
            filename: 'templates.js',
            path: function (path, pathBase) {
                return base.settings.jsPrefix + path.replace(pathBase, '');
            }
        }))
        .pipe(gulp.dest('dist/'));
    } else {
        return gulp.src(['app/**/*.html', '!app/index*.html'])
        .pipe(gulp.dest('dist/'));
    }    
});

gulp.task('build', ['build:html'], function () {
    var jsScriptsFilter = filter('**/*scripts.js', { restore: true });
    var jsVendorFilter = filter('**/*vendor.js', { restore: true });
    var jsHybridFilter = filter('**/hybrid.js', { restore: true });    
    var cssFilter = filter('**/*.css', { restore: true });
    var htmlFilter = filter('**/*.html', { restore: true });
    return gulp.src(['app/index*.html', '!app/index-stage.html'])
        .pipe(replace('<TMPL_VAR NAME=JS_PREFIX_APPS>', ''))
        .pipe(replace('app/', ''))
        .pipe(replace('node_modules/', '../node_modules/'))
        .pipe(replace('<!--templates ', '<'))
        .pipe(replace(' templates--> ', '>'))
        .pipe(useref())
        .pipe(removecode({ prod: true }))

        .pipe(cssFilter)
        .pipe(cleanCSS())
        .pipe(gulpif(base.settings.revCss, rev()))
        .pipe(cssFilter.restore)

        .pipe(jsScriptsFilter)
        .pipe(babel({ presets: ['env'] }))
        .pipe(sourcemaps.init())
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(rev())
        .pipe(sourcemaps.write('.'))
        .pipe(jsScriptsFilter.restore)

        .pipe(jsHybridFilter)
        .pipe(sourcemaps.init())
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(rev())
        .pipe(sourcemaps.write('.'))
        .pipe(jsHybridFilter.restore)

        .pipe(jsVendorFilter)
        .pipe(sourcemaps.init())
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(rev())
        .pipe(sourcemaps.write('.'))
        .pipe(jsVendorFilter.restore)

        .pipe(revReplace({
            prefix: '<TMPL_VAR NAME=JS_BUILD_URL>'
        }))

        .pipe(htmlFilter)
        .pipe(replace('.js.map', '.js'))
        .pipe(lec({ verbose: false, eolc: 'LF', encoding: 'utf8' }))
        .pipe(htmlFilter.restore)

        .pipe(gulp.dest('dist/'));
});
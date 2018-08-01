var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var minifyCss = require('gulp-minify-css');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var imageMin = require('gulp-imagemin');
var handlebars = require('gulp-compile-handlebars');
var rename = require('gulp-rename');
var less = require('gulp-less');
var autoprefixer = require('gulp-autoprefixer');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var htmlmin = require('gulp-htmlmin');
var removeHtmlComments = require('gulp-remove-html-comments');
var purify = require('gulp-purifycss');
var postcss = require('gulp-postcss');
var replace = require('gulp-replace-task');
var fs = require('fs');
var prettify = require('gulp-jsbeautifier');
var jshint = require('gulp-jshint');

gulp.task('lint', function() {
    gulp.src('src/scripts/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('task-replace', function() {
    gulp.src('src/scripts/main-build/main-build.js')
        .pipe(replace({
            patterns: [{
                match: /@global/g,
                replacement: fs.readFileSync('./src/scripts/main-build/1-global.js', 'utf8')
            }, {
                match: /@smallDevices/g,
                replacement: fs.readFileSync('./src/scripts/main-build/2-smallDevices.js', 'utf8')
            }, {
                match: /@bigDevices/g,
                replacement: fs.readFileSync('./src/scripts/main-build/3-bigDevices.js', 'utf8')
            }, {
                match: /@modelForWorker/g,
                replacement: fs.readFileSync('./src/scripts/main-build/4-modelForWorker.js', 'utf8')
            }, {
                match: /@isInViewport/g,
                replacement: fs.readFileSync('./src/scripts/main-build/5-isInViewport.js', 'utf8')
            }, {
                match: /@vis/g,
                replacement: fs.readFileSync('./src/scripts/main-build/6-vis.js', 'utf8')
            }]
        }))
        .pipe(prettify())
        .pipe(rename('main.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('src/scripts/'))
});

gulp.task('combine-css', function() {
    gulp.src(['src/styles/inline.css'])
        .pipe(minifyCss())
        .pipe(gulp.dest('dist/inline'));
});


gulp.task('templates', function() {
    var data = {};
    var options = {
        batch: ['src']
    };
    return gulp.src(['src/templates/**/*.hbs'])
        .pipe(sourcemaps.init())
        .pipe(handlebars(data, options))
        .pipe(rename(function(path) {
            path.extname = '.html'
        }))
        .pipe(gulp.dest('./'))
        .pipe(browserSync.stream());
});

gulp.task('images', function() {
    gulp.src(['src/img/**/*'])
        .pipe(imageMin())
        .pipe(gulp.dest('dist/img'))
        .pipe(browserSync.stream());
})

gulp.task('move', function() {
    gulp.src(['src/styles/fonts/**/*'])
        .pipe(gulp.dest('dist/styles/fonts'));
    gulp.src(['src/video/**/*'])
        .pipe(gulp.dest('dist/video/'));
})

gulp.task('scripts', function() {
//        var b = browserify({
//            entries: 'src/scripts/main.js',
//            debug: true
//        });
//        b.bundle()
    gulp.src(['src/scripts/*.js'])
//                .pipe(source('main.js'))
//                .pipe(buffer())
//                .pipe(sourcemaps.init({loadMaps: true}))
                .pipe(uglify())
//                .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('dist/scripts/'))
});


gulp.task('styles', function() {
    gulp.src(['src/styles/main.less'])
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(autoprefixer())
        .pipe(purify(['dist/scripts/main.js', 'dist/index.html']))
        .pipe(minifyCss())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist/styles/'))
        .pipe(browserSync.stream());
});

gulp.task('minify-html', function() {
    return gulp.src('*.html')
        .pipe(removeHtmlComments())
        .pipe(htmlmin({
            collapseWhitespace: true
        }))
        .pipe(gulp.dest('dist'));
});


gulp.task('default', ['styles', 'move','images','task-replace', 'scripts', 'templates', 'minify-html'], function() {
    browserSync.init({
        server: {
            baseDir: "./"
        },
        browser: 'chrome'
    });
    gulp.watch('src/**/*.hbs', ['templates']);
    gulp.watch('src/img/**/*', ['images']);
    gulp.watch('src/scripts/main-build/**/*.js', ['task-replace']);
    gulp.watch('src/scripts/*.js', ['scripts']);
    gulp.watch('src/**/*.less', ['styles']);
    gulp.watch('*.html', browserSync.reload);
});

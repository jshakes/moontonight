'use strict';

var gulp = require('gulp');
var clean = require('gulp-clean');
var babel = require('gulp-babel');
var browserify = require('gulp-browserify');
var sourcemaps = require('gulp-sourcemaps');
var connect = require('gulp-connect');
var sass = require('gulp-sass');

var src = 'src';
var srcOptions = { base: './' };
var dest = './dist';

gulp.task('clean', function () {
  gulp.src(dest + '/**/*', {
    read: false,
    force: true
  })
    .pipe(clean());
});

gulp.task('es6ToBrowser', function () {

  return gulp.src(src + '/js/main.js')
    .pipe(sourcemaps.init())
    .pipe(browserify({
      insertGlobals : true,
      transform: ['babelify']
    }))
    .pipe(sourcemaps.write('.', { includeContent: false, sourceRoot: '..' }))
    .pipe(gulp.dest(dest + '/js'));
});

gulp.task('sass', function () {

  return gulp.src(src + '/scss/importer.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(dest + '/css'));
});

gulp.task('connect', function() {

  connect.server({
    root: dest,
    livereload: true
  });
});

gulp.task('copyHtml', function() {

  return gulp.src(src + '/**/*.html')
    .pipe(gulp.dest(dest))
    .pipe(connect.reload());
});

gulp.task('watch', function () {

  gulp.watch(src + '/**/*.scss', ['sass']);
  gulp.watch(src + '/**/*.js', ['es6ToBrowser']);
  gulp.watch(src + '/**/*.html', ['copyHtml']);
});

gulp.task('default', ['clean', 'es6ToBrowser', 'sass', 'copyHtml', 'connect', 'watch']);

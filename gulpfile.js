var gulp = require('gulp');
var uglify = require('gulp-uglify');
var browserify = require('browserify');
var babelify = require('babelify');
var minifyify = require('minifyify');
var source = require('vinyl-source-stream');
var connect = require('gulp-connect');

gulp.task('build', function () {
  browserify({
    entries: './app/js/main.js',
    debug: true,
  })
  .transform("babelify", {presets: ["es2015", "react"]})
  .bundle()
  .pipe(source('main.js'))
  // .pipe(minifyify())
  .pipe(gulp.dest('build'));

  connect.server({
  root: 'build/',
  port: 8889
  });
});

gulp.task('html', function () {
  return gulp.src('./app/index.html')
		.pipe(gulp.dest('./build'));
});


gulp.task('default', ['html', 'build']);

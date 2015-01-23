// gulpfile for quick manual testing
// npm install gulp gulp-flattern

var gulp = require('gulp')
var flatten = require('gulp-flatten')
var flattenRequires = require('./')

gulp.task('test', function () {
  return gulp.src('./test/**/*.js')
    .pipe(flatten())
    .pipe(flattenRequires())
    .pipe(gulp.dest('./flattened'))
})
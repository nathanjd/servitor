var gulp = require('gulp');
var path = require('path');

var favIconPath =
    path.resolve(__dirname, '..', '..', 'src', 'www', 'favicon.ico');

var buildDir = path.resolve(__dirname, '..', '..', 'build');

gulp.task('assets', function () {
    gulp.src(favIconPath)
        .pipe(gulp.dest(buildDir));
});

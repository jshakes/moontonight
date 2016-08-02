import runSequence from 'run-sequence';

export default function (gulp) {
  gulp.task('build', (done) => {
    runSequence(
      'jekyll-build',
      [
        'images',
        'fonts',
        'css-minified',
        'js-production',
      ],
      done
    );
  });

  gulp.task('watch', (done) => {
    runSequence(
      [
        'css-watch',
        'images-watch',
        'fonts-watch',
        'js-watch',
      ],
      'jekyll-async',
      [
        'connect',
        'jekyll-watch',
      ],
      done
    );
  });

  gulp.task('clean', ['jekyll-clean']);

  return ['build', 'watch', 'clean'];
}

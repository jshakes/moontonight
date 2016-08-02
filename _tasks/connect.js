import path from 'path';
import connect from 'gulp-connect';
import modRewrite from 'connect-modrewrite';
import watch from 'gulp-watch';

export default function (gulp, settings) {
  gulp.task('connect', () => {
    if (!settings.build.features.serve.enabled) {
      return;
    }
    connect.server({
      port: settings.build.features.serve.port,
      root: settings.main.destination,
      livereload: true,
      middleware: () => [
        modRewrite(['^([^\\.]*[^\\/])$ $1.html']),
      ],
    });
    Promise.delay(500).then(() => {
      watch([
        path.resolve(__dirname, '..', settings.main.destination, '**/*'),
        `!${path.resolve(__dirname, '..', settings.main.destination, '**/*.map')}`,
      ], { verbose: true }).pipe(connect.reload());
    });
  });
}

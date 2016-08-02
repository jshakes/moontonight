import cp from 'child_process';
import path from 'path';
import gulpUtil from 'gulp-util';
import connect from 'gulp-connect';
import watch from 'gulp-watch';

export default function (gulp, settings) {
  gulp.task('jekyll-build', () => {
    if (!settings.build.features.jekyll.enabled) {
      return Promise.resolve(null);
    }
    return new Promise((resolve) => {
      cp.spawn('jekyll', ['build', '--config', '_config/config.yml'], { stdio: 'inherit' }).on('close', resolve);
    });
  });

  gulp.task('jekyll-clean', () => {
    if (!settings.build.features.jekyll.enabled) {
      return Promise.resolve(null);
    }
    return new Promise((resolve) => {
      cp.spawn('jekyll', ['clean', '--config', '_config/config.yml'], { stdio: 'inherit' }).on('close', resolve);
    });
  });

  let jekyllIsBuilding = false;

  const jekyllAsyncBuild = () => {
    if (!settings.build.features.jekyll.enabled || jekyllIsBuilding) {
      return Promise.resolve(null);
    }
    jekyllIsBuilding = true;
    const jekyll = cp.spawn('jekyll', ['build', '--config', '_config/config.yml']);

    return new Promise((resolve) => {
      jekyll.on('exit', () => {
        gulpUtil.log('Finished Jekyll Build');
        jekyllIsBuilding = false;
        resolve();
      });
    });
  };

  gulp.task('jekyll-async', () => jekyllAsyncBuild());

  gulp.task('jekyll-watch', () => {
    if (!settings.build.features.jekyll.enabled) {
      return;
    }

    // $.watch([
    //   '**/*.html',
    //   '**/*.md',
    //   '**/*.textile',
    //   '**/*.yml',
    //   `!${settings.server.root}`,
    //   `!${settings.server.root}/*`,
    //   `!${settings.server.root}/**/*`,
    //   `!${settings.server.assets}`,
    //   `!${settings.server.assets}/*`,
    //   `!${settings.server.assets}/**/*`,
    // ], () => {
    //   jekyllAsyncBuild(() => null);
    // });

    watch([
      `${settings.main.source}/**/*`,
      `${path.resolve(__dirname, '..', '_config')}/**/*`,
    ], () => {
      jekyllAsyncBuild();
    });
  });

  return [];
}

import path from 'path';
import rsync from 'gulp-rsync';

export default function (gulp, settings) {
  if (!settings.deploy.rsync.enabled) {
    return [];
  }

  const rsyncOptions = {
    src: path.resolve(__dirname, '..', settings.main.destination, '**'),

    options: {
      destination: settings.deploy.rsync.destination,
      root: path.resolve(__dirname, '..', settings.main.destination),
      username: settings.deploy.rsync.username,
      incremental: settings.deploy.rsync.incremental,
      progress: settings.deploy.rsync.progress,
      relative: settings.deploy.rsync.relative,
      emptyDirectories: settings.deploy.rsync.emptyDirectories,
      recursive: settings.deploy.rsync.recursive,
      clean: settings.deploy.rsync.clean,
      exclude: settings.deploy.rsync.exclude,
      include: settings.deploy.rsync.include,
    },
  };

  gulp.task('rsync', () => gulp.src(rsyncOptions.src).pipe(rsync(rsyncOptions.options)));

  return ['rsync'];
}

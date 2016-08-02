import cp from 'child_process';

export default function (gulp, settings) {
  if (!settings.deploy.surge.enabled) {
    return [];
  }

  gulp.task('surge', (done) => cp.spawn('surge', ['-d', `${settings.deploy.domain}`, settings.main.destination], { stdio: 'inherit' }).on('close', done));
  return ['surge'];
}

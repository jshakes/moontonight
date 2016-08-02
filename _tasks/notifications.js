import notify from 'gulp-notify';
import path from 'path';
import notifier from 'node-notifier';
import gulpUtil from 'gulp-util';

export default function (_, config) {
  notify.logLevel(0);
  const errorImg = path.resolve(__dirname, '..', 'node_modules/gulp-notify/assets/gulp-error.png');

  global.handleErrors = function (area, error) {
    gulpUtil.log(gulpUtil.colors.red('Compile Error ::', error.message));
    if (!config.build.features.notifications.enabled) {
      return;
    }
    notifier.notify({
      title: 'Compilation Failed!',
      message: `Error during ${area} task.`,
      icon: errorImg,
    });
  };

  return null;
}

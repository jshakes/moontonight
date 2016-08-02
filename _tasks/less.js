import path from 'path';
import plumber from 'gulp-plumber';
import less from 'gulp-less';
import sourcemaps from 'gulp-sourcemaps';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import cleanCss from 'gulp-clean-css';
import watch from 'gulp-watch';

export default function (gulp, settings) {
  if (settings.build.features.css.mode !== 'less') {
    return null;
  }

  const cssSourcePath = path.resolve(__dirname, '..', settings.build.paths.source.less, '**/*.less');
  const cssBundlePath = path.resolve(__dirname, '..', settings.build.paths.source.less, settings.build.features.css.bundle);
  const cssDestPath = path.resolve(__dirname, '..', settings.main.destination, settings.build.paths.destination.less);

  const buildLess = function (minify) {
    if (!settings.build.features.css.enabled) {
      return Promise.resolve(null);
    }

    let chain = gulp.src(cssBundlePath).pipe(plumber({ errorHandler: (err) => {
      handleErrors('LESS', err);
    } })).pipe(less());

    if (!minify) {
      chain = chain.pipe(sourcemaps.init());
    }

    if (settings.build.features.css.autoprefix.enabled) {
      chain = chain.pipe(postcss([autoprefixer(settings.build.features.css.autoprefix.settings)]));
    }

    if (!minify) {
      chain = chain.pipe(sourcemaps.write());
    }

    if (minify && settings.build.features.css.minify) {
      chain = chain.pipe(cleanCss());
    }

    chain = chain.pipe(gulp.dest(cssDestPath));

    return new Promise((resolve) => {
      chain.on('end', resolve);
    });
  };

  gulp.task('css', () => buildLess(false));

  gulp.task('css-minified', () => buildLess(true));

  gulp.task('css-watch', () => {
    watch(cssSourcePath, () => {
      buildLess(false);
    });
    return buildLess(false);
  });

  return null;
}

import fs from 'fs';
import path from 'path';
import browserify from 'browserify';
import watchify from 'watchify';
import babelify from 'babelify';
import uglify from 'gulp-uglify';
import vinylSource from 'vinyl-source-stream';
import vinylBuffer from 'vinyl-buffer';

const babelConfig = JSON.parse(fs.readFileSync(path.resolve(__dirname, '..', '.babelrc'), 'utf8'));

export default function (gulp, settings) {
  const jsSrcPath = path.resolve(__dirname, '..', settings.build.paths.source.js);
  const jsDestPath = path.resolve(__dirname, '..', settings.main.destination, settings.build.paths.destination.js);

  const buildScript = function (file, watch, minify) {
    if (!file) {
      return Promise.resolve(null);
    }

    const entries = [];
    entries.push(path.resolve(jsSrcPath, file));

    const props = {
      entries,
      debug: !minify,
    };

    const browserifyExec = browserify(props); // .plugin(pathmodify(), pathmodOpts);
    const bundler = watch ? watchify(browserifyExec) : browserifyExec;

    bundler.transform(babelify, babelConfig);

    const rebundle = function () {
      const stream = bundler.bundle();

      // let chain = stream.on('error', $.plumber({errorHandler: (err) => handleErrors('Browserify', err)}));
      let chain = stream.on('error', (err) => handleErrors('Browserify', err));
      chain = chain.pipe(vinylSource(file));

      if (minify && settings.build.features.js.minify) {
        chain = chain
          .pipe(vinylBuffer())
          .pipe(uglify());
      }

      chain = chain.pipe(gulp.dest(jsDestPath));

      return new Promise((resolve) => {
        chain.on('end', resolve);
      });
    };

    bundler.on('update', () => {
      rebundle();
    });

    return rebundle();
  };

  gulp.task('js', () => {
    const tasks = [];
    settings.build.paths.jsBundles.forEach((file) => {
      tasks.push(buildScript(file, false, false));
    });
    if (tasks.length === 0) {
      return null;
    }
    return Promise.all(tasks);
  });

  gulp.task('js-watch', () => {
    const tasks = [];
    settings.build.paths.jsBundles.forEach((file) => {
      tasks.push(buildScript(file, true, false));
    });
    if (tasks.length === 0) {
      return null;
    }
    return Promise.all(tasks);
  });

  gulp.task('js-production', () => {
    const tasks = [];
    settings.build.paths.jsBundles.forEach((file) => {
      tasks.push(buildScript(file, false, true));
    });
    if (tasks.length === 0) {
      return null;
    }
    return Promise.all(tasks);
  });

  return null;
}

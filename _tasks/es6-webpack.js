import path from 'path';
import fs from 'fs';
import _ from 'lodash';
import webpack from 'webpack-stream';
// import webpackRaw from 'webpack';

const configMerge = function (objValue, srcValue) {
  if (_.isArray(objValue)) {
    return objValue.concat(srcValue);
  }
  return null;
};

const babelConfig = _.mergeWith(JSON.parse(fs.readFileSync(path.resolve(__dirname, '..', '.babelrc'), 'utf8')), { plugins: ['transform-runtime'] }, configMerge);

export default function (gulp, settings) {
  const jsSrcPath = path.resolve(__dirname, '..', settings.build.paths.source.js);
  const jsDestPath = path.resolve(__dirname, '..', settings.main.destination, settings.build.paths.destination.js);

  const webpackEntries = {};
  const gulpSrcEntries = [];
  settings.build.paths.jsBundles.forEach((file) => {
    const fullPath = path.resolve(jsSrcPath, file);
    webpackEntries[file.replace(/\.js$/ig, '').replace(/[^a-z0-9_\-]/ig, '')] = fullPath;
    gulpSrcEntries.push(fullPath);
  });

  const runWebpack = function (watch, minify) {
    if (!gulpSrcEntries || gulpSrcEntries.length === 0) {
      return Promise.resolve(null);
    }

    const webpackConfig = {
      entry: webpackEntries,
      output: {
        filename: '[name].js',
      },
      watch,
      module: {
        loaders: [
          {
            test: /\.jsx?$/i,
            loader: 'babel',
            exclude: /(node_modules|bower_components)/,
            query: babelConfig,
          },
        ],
      },
      resolve: {
        extensions: ['', '.js', '.jsx'],
      },
    };

    if (!minify) {
      webpackConfig.devtool = 'source-map';
    } else {
      /* eslint-disable new-cap */
      webpackConfig.plugins = [new webpack.webpack.optimize.UglifyJsPlugin({
        sourceMap: false,
        mangle: {
          except: ['$super', '$', 'exports', 'require'],
        },
      })];
      /* eslint-enable new-cap */
    }

    if (watch) {
      gulp.src(gulpSrcEntries)
      .pipe(webpack(webpackConfig))
      .on('error', (err) => handleErrors('Webpack', err))
      .pipe(gulp.dest(jsDestPath));
      return Promise.resolve(null);
    }

    return new Promise((resolve) => {
      gulp.src(gulpSrcEntries)
      .pipe(webpack(webpackConfig))
      .on('error', (err) => handleErrors('Webpack', err))
      .pipe(gulp.dest(jsDestPath))
      .on('end', resolve);
    });
  };

  gulp.task('js', () => runWebpack(false, false));
  gulp.task('js-watch', () => runWebpack(true, false));
  gulp.task('js-production', () => runWebpack(false, true));

  return null;
}

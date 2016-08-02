import yargs from 'yargs';
import _ from 'lodash';
import path from 'path';
import touch from 'touch';
import fs from 'fs';
import mkdirp from 'mkdirp';

function cleanup(name) {
  return _.trim(name, ' /');
}

function getNamespace(name) {
  if (name.indexOf('/') === -1) {
    return false;
  }
  const pathComponents = name.split('/');
  return pathComponents.shift();
}

function getFilename(name) {
  const pathComponents = name.split('/');
  return pathComponents.pop();
}

function getPathToFile(name) {
  const pathComponents = name.split('/');
  pathComponents.pop();
  return pathComponents.join('/');
}

function getFullPath(name) {
  return name;
}

export default function (gulp, settings) {
  gulp.task('g:component', () => {
    const name = cleanup(yargs.argv.name);
    if (name === '') {
      return;
    }

    const INCLUDES_DIR = path.resolve(__dirname, '..', settings.main.source, settings.main.includes_dir);
    const CSS_DIR = path.resolve(__dirname, '..', settings.build.paths.source[settings.build.features.css.mode]);
    const COMPONENTS_DIRNAME = settings.build.paths.components;
    const MAIN_CSS_PATH = path.resolve(__dirname, '..', settings.build.paths.source[settings.build.features.css.mode], settings.build.features.css.bundle);

    const filename = getFilename(name);
    const namespace = getNamespace(name);
    const fullPath = getFullPath(name);
    const pathToFile = getPathToFile(name);
    const prefix = settings.build.features.css.mode === 'scss' ? '_' : '';
    const namespaceFilePath = path.resolve(CSS_DIR, COMPONENTS_DIRNAME, `${prefix}${namespace}.${settings.build.features.css.mode}`);

    mkdirp.sync(path.resolve(CSS_DIR, COMPONENTS_DIRNAME, pathToFile));
    mkdirp.sync(path.resolve(INCLUDES_DIR, COMPONENTS_DIRNAME, pathToFile));
    touch.sync(path.resolve(CSS_DIR, COMPONENTS_DIRNAME, pathToFile, `${prefix}${filename}.${settings.build.features.css.mode}`));
    touch.sync(path.resolve(INCLUDES_DIR, COMPONENTS_DIRNAME, pathToFile, `${filename}.html`));

    const mainContent = fs.readFileSync(MAIN_CSS_PATH, 'utf8');

    if (namespace) {
      touch.sync(namespaceFilePath);
      const namespaceContent = fs.readFileSync(namespaceFilePath, 'utf8');
      if (namespaceContent.indexOf(`"${fullPath}"`) === -1) {
        fs.appendFileSync(namespaceFilePath, `@import "${fullPath}";\n`, 'utf8');
      }
      if (mainContent.indexOf(`"components/${namespace}"`) === -1) {
        fs.appendFileSync(MAIN_CSS_PATH, `@import "components/${namespace}";\n`, 'utf8');
      }
    } else {
      if (mainContent.indexOf(`"components/${fullPath}"`) === -1) {
        fs.appendFileSync(MAIN_CSS_PATH, `@import "components/${fullPath}";\n`, 'utf8');
      }
    }
  });

  return ['g:component'];
}

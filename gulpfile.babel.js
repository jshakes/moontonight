//
// DO NOT MODIFY THIS FILE DIRECTLY
// USE _tasks DIR INSTEAD
//

import yaml from 'js-yaml';
import fs from 'fs';
import path from 'path';
import gulp from 'gulp';
import gulpUtil from 'gulp-util';
import chalk from 'chalk';
import bluebird from 'bluebird';
import * as tasks from './_tasks';

// REPLACE PROMISES WITH BLUEBIRD
global.Promise = bluebird;

// LOADING CONFIGURATIONS
const CONFIG_PATH = path.resolve(__dirname, '_config');
const CONFIG_NAMES = {
  main: 'config.yml',
  build: 'build.yml',
  deploy: 'deploy.yml',
};

const config = {
  main: yaml.safeLoad(fs.readFileSync(path.resolve(CONFIG_PATH, CONFIG_NAMES.main), 'utf-8')),
  build: yaml.safeLoad(fs.readFileSync(path.resolve(CONFIG_PATH, CONFIG_NAMES.build), 'utf-8')),
  deploy: yaml.safeLoad(fs.readFileSync(path.resolve(CONFIG_PATH, CONFIG_NAMES.deploy), 'utf-8')),
};

// PARSING AND INITIALIZING DYNAMIC TASKS
let availableTasks = [];
Object.keys(tasks).forEach((key) => {
  const task = tasks[key];
  availableTasks = availableTasks.concat(task(gulp, config));
});
availableTasks = availableTasks.filter((task) => typeof task === 'string' && task !== '');

// DEFAULT TASK DOES LISTS ALL AVAILABLE TASKS
gulp.task('default', () => {
  if (availableTasks.length > 0) {
    gulpUtil.log(chalk.green.bold(`Available tasks: ${[''].concat(availableTasks).join('\n\t\t• ')}`));
  } else {
    gulpUtil.log(chalk.red.bold('No available tasks'));
  }
});

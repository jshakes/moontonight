// General
export { default as notifications } from './notifications.js';

// Assets pipeline (Images)
export { default as copy } from './copy.js';

// Assets pipeline (SCSS)
export { default as scss } from './scss.js';
export { default as less } from './less.js';

// Assets pipeline (JS / JSX)
// export { default as es6 } from './es6-browserify.js';
export { default as es6 } from './es6-webpack.js';

// Jekyll
export { default as jekyll } from './jekyll.js';

// Webserver + Livereload
export { default as connect } from './connect.js';

// Deployments
export { default as rsync } from './rsync.js';
export { default as surge } from './surge.js';

// Generators
export { default as generators } from './generators.js';

// Metacommands
export { default as meta } from './meta.js';

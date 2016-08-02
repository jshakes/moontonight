# Front-end boilerplate

## Requirements

- Ruby 2.1+
- Node 5.0+

## Installation

- `npm install -g frot`
- `frot [path]`

## Folder Structure

The demo project homepage contains a detailed project structure explanation. See development section to learn how to build and see the homepage.

## Development

- Run `gulp watch`
- Open [http://127.0.0.1:8080](http://127.0.0.1:8080) in your browser.
- Livereload is enabled by default.
- Make sure your code editor / IDE has ESLint support.

## Building

- `gulp clean` to cleanup the output folder.
- `gulp build` to build and optimize / minify assets.
- See build settings in `_config` dir.

## Deployment

- `gulp surge` for Surge deployment.
- `gulp rsync` for SSH deployment via RSync.
- See deployment settings in `_config` dir.

## Components

- Try to follow the concept of components when developing the front-end.
-  Types of Components
  - _Page Blocks_ are components that are not related to the actual content (eg. header and footer).
  - _Regular Components_ are elementary blocks, used to build the content.
- Regular components should be flexible enough to be reused on any other page.
- Each component should have a dedicated partial in `_source/_includes/components` (Unless it's a ReactJS Component).
- Each component should have a dedicated stylesheet in `_assets/scss/components`
- If the component requires JS or is a ReactJS component, it should have a dedicated JS in `_assets/js/components`

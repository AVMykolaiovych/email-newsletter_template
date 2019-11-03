const { src, dest, watch, series, parallel } = require('gulp');
const sass = require('gulp-sass');
const inky = require('inky');
const inlineCss = require('gulp-inline-css');
const inlinesource = require('gulp-inline-source');
const browserSync = require("browser-sync");

const files = {
	scssPath: "./scss/*.scss",
	cssPath: "./css",
	htmlPath: "./templates/**/*.html",
	dist: "./dist"
};

const browserSyncTask = () => {
	browserSync({
		server: { baseDir: files.dist },
		notify: false,
	})
}

const scssTask = () => {
	return src(files.scssPath)
		.pipe(sass().on('error', sass.logError))
		.pipe(dest(files.cssPath))
}

const inkyTask = () => {
	return src(files.htmlPath)
		.pipe(inlinesource())
		.pipe(inky())
		.pipe(inlineCss({
			preserveMediaQueries: true,
			removeLinkTags: false
		}))
		.pipe(dest(files.dist))
		.pipe(browserSync.reload({ stream: true }));
}

const watchTask = () => {
	watch(files.scssPath, parallel(scssTask));
	watch(files.htmlPath, parallel(inkyTask));
}

exports.default = series(parallel(scssTask, inkyTask, browserSyncTask, watchTask))

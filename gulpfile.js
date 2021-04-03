import gulp from "gulp";
import { paths } from "./app/config/paths.js";
import path, { join } from "path";
import sass from "gulp-sass";
import babel from "gulp-babel";
import sourceMaps from "gulp-sourcemaps";
import uglify from "gulp-uglify";
import cssnano from "gulp-cssnano";
import autoprefixer from "gulp-autoprefixer";
import concat from "gulp-concat";
import changed from "gulp-changed";
import clean from "gulp-clean";
import rename from "gulp-rename";
import imgmin from "gulp-imagemin";
import bsync from "browser-sync";
import del from "del";

const browsersync = bsync.create();

const { src, dest, parallel, series, watch } = gulp;

export const delAssets = () => {
  return del(paths.dist);
};

export const clear = () => {
  return src(paths.src + "sass/**/*.scss", {
    read: false,
  }).pipe(clean());
};

export const style = () => {
  return src(paths.src + "sass/global.scss")
    .pipe(sourceMaps.init())
    .pipe(changed(paths.src + "sass/**/*.scss"))
    .pipe(sass().on("error", sass.logError))
    .pipe(
      autoprefixer({
        overrideBrowserslist: ["last 2 versions"],
        cascade: false,
      })
    )
    .pipe(
      rename({
        extname: ".min.css",
      })
    )
    .pipe(cssnano())
    .pipe(sourceMaps.write("."))
    .pipe(dest(paths.dist + "css"))
    .pipe(browsersync.stream());
};

export const js = () => {
  return src(paths.src + "js/**/*.js")
    .pipe(changed(paths.src + "js/**/*.js"))
    .pipe(sourceMaps.init())
    .pipe(
      babel({
        presets: ["@babel/env"],
      })
    )
    .pipe(concat("bundle.js"))
    .pipe(uglify())
    .pipe(
      rename({
        extname: ".min.js",
      })
    )
    .pipe(sourceMaps.write("."))
    .pipe(dest("./app/build/js"))
    .pipe(browsersync.stream());
};

export const watchFiles = () => {
  watch(paths.src + "sass/**/*.scss", style);
  watch(paths.src + "js/**/*.js", js);
  // watch("./assets/images/*"), img);
};

export const browserSync = () => {
  browsersync.init({
    proxy: "localhost:3000",
    notify: false,
    open: false,
  });
};

export const dev = parallel(
  series(delAssets, style, js),
  watchFiles,
  browserSync
);
export const build = series(delAssets, clear, parallel(style, js));
export default dev;

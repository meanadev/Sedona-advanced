const gulp = require("gulp");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const sass = require("gulp-sass");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const csso = require("gulp-csso");
const rename = require("gulp-rename");
const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp");
const svgstore = require("gulp-svgstore");
const del = require("del");
const sync = require("browser-sync").create();

// Clean

const clean = () => {
  return del("build");
};

exports.clean = clean;

// Copy artifacts

const copy = () => {
  return gulp
    .src(["source/fonts/**/*.{woff,woff2}", "source/img/**", "source/js/**", "source/**/*.html"], { base: "source" })
    .pipe(gulp.dest("build"));
};

exports.copy = copy;

// Copy html

const html = () => {
  return gulp.src(["source/**/*.html"], { base: "source" }).pipe(gulp.dest("build"));
};

exports.html = html;

// Images

const images = () => {
  return gulp
    .src("source/img/**/*.{jpg,png,svg}")
    .pipe(imagemin([imagemin.optipng({ optimizationLevel: 3 }), imagemin.mozjpeg({ progressive: true }), imagemin.svgo()]));
};

exports.images = images;

// Webp

const webpImages = () => {
  return gulp
    .src("source/img/**/*.{jpg,png}")
    .pipe(webp({ quality: 90 }))
    .pipe(gulp.dest("source/img"));
};

exports.webpImages = webpImages;

// Sprite

const sprite = () => {
  return gulp.src("source/img/icon-*.svg").pipe(svgstore()).pipe(rename("sprite.svg")).pipe(gulp.dest("build/img"));
};

exports.sprite = sprite;

// Styles

const styles = () => {
  return gulp
    .src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(
      sass({
        includePaths: ["node_modules"],
      })
    )
    .pipe(postcss([autoprefixer()]))
    .pipe(csso())
    .pipe(rename("styles.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"))
    .pipe(sync.stream());
};

exports.styles = styles;

// Server

const server = (done) => {
  sync.init({
    server: {
      baseDir: "build",
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
};

exports.server = server;

// Watcher

const watcher = () => {
  gulp.watch("source/sass/**/*.scss", gulp.series(styles));
  gulp.watch("source/*.html", gulp.series(html));
  gulp.watch("source/*.html").on("change", sync.reload);
};

gulp.task("build", gulp.series(clean, copy, styles, sprite, html));
gulp.task("start", gulp.series("build", server, watcher));

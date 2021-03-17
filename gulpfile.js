const gulp = require('gulp');
const cleanCSS = require('gulp-clean-css');
const htmlmin = require('gulp-html-minifier-terser');
const htmlclean = require('gulp-htmlclean');

const workbox = require("workbox-build");
// gulp-tester
const terser = require('gulp-terser');
// babel
// const uglify = require('gulp-uglify');
// const babel = require('gulp-babel');

//pwa
gulp.task('generate-service-worker', () => {
  return workbox.injectManifest({
    swSrc: './sw-template.js',
    swDest: './public/sw.js',
    globDirectory: './public',
    globPatterns: [
        "**/*.{html,css,js,json,woff2,ttf,xml}"
    ],
    modifyURLPrefix: {
        "": "./"
    }
  });
});

//minify js babel
// gulp.task('compress', () =>
//   gulp.src(['./public/**/*.js', '!./public/**/*.min.js','!./public/js/custom/galmenu.js','!./public/js/custom/gitcalendar.js','!./public/js/custom/runtime.js','!./public/js/custom/wow_init.js','!./public/live2d_widget/waifu_init.js','!./public/live2d_widget/waifu-tips.js'])
// 		.pipe(babel({
// 			presets: ['@babel/preset-env']
// 		}))
//     .pipe(uglify().on('error', function(e){
//       console.log(e);
//     }))
// 		.pipe(gulp.dest('./public'))
// );
// minify js - gulp-tester
gulp.task('compress', () =>
  gulp.src(['./public/**/*.js', '!./public/**/*.min.js'])
    .pipe(terser())
    .pipe(gulp.dest('./public'))
)

//css
gulp.task('minify-css', () => {
  return gulp.src('./public/**/*.css')
    .pipe(cleanCSS({
      compatibility: 'ie11'
    }))
    .pipe(gulp.dest('./public'));
});


// 壓縮 public 目錄內 html
gulp.task('minify-html', () => {
  return gulp.src('./public/**/*.html')
    .pipe(htmlclean())
    .pipe(htmlmin({
      removeComments: true, //清除 HTML 註釋
      collapseWhitespace: true, //壓縮 HTML
      collapseBooleanAttributes: true, //省略布爾屬性的值 <input checked="true"/> ==> <input />
      removeEmptyAttributes: true, //刪除所有空格作屬性值 <input id="" /> ==> <input />
      removeScriptTypeAttributes: true, //刪除 <script> 的 type="text/javascript"
      removeStyleLinkTypeAttributes: true, //刪除 <style> 和 <link> 的 type="text/css"
      minifyJS: true, //壓縮頁面 JS
      minifyCSS: true, //壓縮頁面 CSS
      minifyURLs: true
    }))
    .pipe(gulp.dest('./public'))
});

// 執行 gulp 命令時執行的任務
gulp.task("default", gulp.series("generate-service-worker", gulp.parallel(
    'compress','minify-html', 'minify-css'
)));

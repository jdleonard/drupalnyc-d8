/* eslint-disable */
var gulp = require('gulp');
var concat = require('gulp-concat');
var del = require('del');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var sassGlob = require('gulp-sass-glob');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var livereload = require('gulp-livereload');
var sassLint = require('gulp-sass-lint');
var autoprefixer = require('gulp-autoprefixer');

var paths = {
  scripts: [
    'js/**/*.js',
    '!js/**/*.min.js'
  ],
  sass: {
    main: 'sass/drupalnyc.styles.scss',
    watch: 'sass/scss/**/*'
  },
  css: {
    root: 'css'
  },
  clean: [
    'css/styles.css',
    'css/**/*.css.map',
    'js/**/*.min.js'
  ]
};

gulp.task('clean', function () {
  'use strict';
  return del(paths.clean);
});

gulp.task('sass-lint', function () {
  'use strict';
  return gulp.src(paths.sass.watch)
      .pipe(sassLint({
        files: {
          ignore: [
            'bower_components/**/*.scss',
            'styles/scss/normalize/**',
            'styles/scss/abstractions/_fonts.scss',
            'styles/scss/styles.scss'
          ]
        },
        rules: {
          'no-ids': 0,
          'nesting-depth': [1, {'max-depth': 4}],
          'no-qualifying-elements': [1, {'allow-element-with-class': true}],
          'force-element-nesting': 0,
          'force-pseudo-nesting': 0,
          'property-sort-order': 0,
          'no-vendor-prefixes': 0,
          'mixins-before-declarations': [1, {exclude: ['media']}],
          'placeholder-in-extend': 0,
          'single-line-per-selector': 0,
          'no-misspelled-properties': [1, {'extra-properties': ['-webkit-overflow-scrolling']}],
          'class-name-format': 0
        }
      }))
      .pipe(sassLint.format())
      .pipe(sassLint.failOnError());
});


gulp.task('lint', gulp.series(gulp.parallel('sass-lint')));

gulp.task('compress', function () {
  'use strict';
  return gulp.src(paths.scripts)
      .pipe(rename({suffix: '.min'}))
      .pipe(uglify())
      .pipe(gulp.dest('js/dist'));
});

gulp.task('sass', function () {
  'use strict';
  return gulp.src(paths.sass.main)
      .pipe(sassGlob())
      .pipe(sourcemaps.init())
      .pipe(sass({
        includePaths: [
          'node_modules/support-for/sass',
          'node_modules/breakpoint-sass/stylesheets'
        ]
      }).on('error', sass.logError))
      .pipe(autoprefixer())
      .pipe(sourcemaps.write('./maps'))
      .pipe(gulp.dest(paths.css.root))
      .pipe(livereload());
});

gulp.task('sourcemaps', function () {
  'use strict';
  return gulp.src(paths.sass.main)
      .pipe(sassGlob())
      .pipe(sourcemaps.init())
      .pipe(sass().on('error', sass.logError))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest(paths.css.root));
});

gulp.task('build', gulp.series(gulp.parallel('sass', 'compress')));

gulp.task('watch', gulp.series(gulp.parallel('build'), function () {
  'use strict';
  livereload.listen();
  gulp.watch(paths.sass.watch, gulp.parallel('sass'));
  gulp.watch(paths.scripts, gulp.parallel('compress'));
}));

gulp.task('default', gulp.parallel('build'));

var fs = require('fs');
var path = require('path');

var gulp = require('gulp');

// Load all gulp plugins automatically
// and attach them to the `plugins` object
var plugins = require('gulp-load-plugins')();

// Temporary solution until gulp 4
// https://github.com/gulpjs/gulp/issues/355
var runSequence = require('run-sequence').use(gulp);

var browserSync = require('browser-sync').create();
var del = require('del');

// Define Source's Paths
var src = {
  base: './app',
  jade: './app/**/*.jade',
  scss: './app/styles/**/*.scss',
  scripts: './app/scripts/**/*.js',
  images: './app/images/**/*',
  fonts: './app/fonts/**/*',
};

// Define Build's Paths
var dist = {
  base: './public',
  jade: './public/**/',
  scss: './public/stylesheets/',
  scripts: './public/javascripts/',
  images: './public/images/',
  fonts: './public/fonts/',
};


/*******************************************************************************
* Bowser Sync task
*******************************************************************************/
gulp.task('browser-sync', function() {
  browserSync.init({
    server: {
      baseDir: dist.base
    }
  });
})

/*******************************************************************************
* Cleaner task
*******************************************************************************/
gulp.task('clean', function() {
  del(dist.base)
});

/*******************************************************************************
* Jade related tasks
*******************************************************************************/
gulp.task('jade', function() {
  return gulp.src(src.jade)
    .pipe(plugins.plumber())
    .pipe(plugins.jade())
    .pipe(gulp.dest(dist.base))
    .pipe(browserSync.stream())
});

/*******************************************************************************
* SASS related tasks
*******************************************************************************/
gulp.task('sass', ['sass-lint', 'sass-maps', 'sass-min'], function() {
});

// Lint
gulp.task('sass-lint', function() {
  return gulp.src(src.scss)
    .pipe(plugins.plumber())
    .pipe(plugins.sassLint())
    .pipe(plugins.sassLint.format())
    .pipe(plugins.sassLint.failOnError())
});

// Sourcemaps
gulp.task('sass-maps', function() {
  return gulp.src(src.scss)
    .pipe(plugins.plumber())
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.sass())
    .pipe(plugins.autoprefixer([
      'last 2 versions',  
      '> 2%',
      'ie >= 10']))
    .pipe(plugins.sourcemaps.write('./'))
    .pipe(gulp.dest(dist.scss))
});

// Minify
gulp.task('sass-min', function() {
  return gulp.src(src.scss)
    .pipe(plugins.plumber())
    .pipe(plugins.sass())
    .pipe(plugins.autoprefixer([
      'last 2 versions',  
      '> 2%',
      'ie >= 10']))
    .pipe(plugins.rename({suffix: '.min'}))
    .pipe(plugins.minifyCss())
    .pipe(gulp.dest(dist.scss))
});

/*******************************************************************************
* Bower related tasks
*******************************************************************************/
gulp.task('assets',['angular', 'bootstrap'], function() {
});

gulp.task('angular', function() {
  return gulp.src('./bower_components/angular/angular.min.js')
    .pipe(plugins.plumber())
    .pipe(gulp.dest('./public/javascripts'))
});

gulp.task('bootstrap', function() {
  return gulp.src('./bower_components/bootstrap/dist/css/bootstrap.min.css')
    .pipe(plugins.plumber())
    .pipe(gulp.dest('./public/stylesheets'))
});

/*******************************************************************************
* Typographic related tasks
*******************************************************************************/
gulp.task('fonts', function() {
  return gulp.src(src.fonts)
    .pipe(plugins.plumber())
    .pipe(gulp.dest(dist.fonts))
    .pipe(browserSync.stream())
});

/*******************************************************************************
* Image related tasks
*******************************************************************************/
gulp.task('images', function() {
  return gulp.src(src.images)
    .pipe(plugins.plumber())
    .pipe(plugins.imagemin(
      {optimizationLevel: 3, 
        progressive: true, 
        interlaced: true }))
    .pipe(gulp.dest(dist.images))
    .pipe(browserSync.stream())
});

/*******************************************************************************
* Scripts related tasks
*******************************************************************************/
gulp.task('scripts', function() {
  return gulp.src([src.scripts])
    .pipe(plugins.plumber())
    .pipe(plugins.jshint())
    .pipe(plugins.jshint.reporter('jshint-stylish'))
    .pipe(gulp.dest(dist.scripts))
    .pipe(plugins.rename({suffix: '.min'}))
    .pipe(plugins.uglify())
    .pipe(gulp.dest(dist.scripts))
    .pipe(browserSync.stream())
});

/*******************************************************************************
* Tests related tasks
*******************************************************************************/
gulp.task('ui-tests', function () {
  return gulp.src('./test/ui/home.js')
    .pipe(plugins.plumber())
    .pipe(plugins.casperjs())
});

/*******************************************************************************
* Main tasks
*******************************************************************************/
gulp.task('build', function () {
  runSequence('clean','fonts','images','jade','scripts','assets','sass');
});

// Watch Related Tasks
gulp.task('jade-watch', ['jade'], browserSync.reload);
gulp.task('sass-watch', ['sass'], browserSync.reload);
gulp.task('scripts-watch', ['scripts'], browserSync.reload);
gulp.task('fonts-watch', ['fonts'], browserSync.reload);
gulp.task('images-watch', ['images'], browserSync.reload);

// Watch's Main Task
gulp.task('watch', ['build'], function() {

    // Starts the Server after building 'em all
    browserSync.init({
      server: {
        baseDir: dist.base
      }
    });

  // Watch for changes
  gulp.watch(src.scss, ['sass-watch']);
  gulp.watch(src.fonts, ['fonts-watch']);
  gulp.watch(src.scripts, ['scripts-watch']);
  gulp.watch(src.images, ['images-watch']);
  gulp.watch(src.jade, ['jade-watch']);
});

gulp.task('default', ['build']);

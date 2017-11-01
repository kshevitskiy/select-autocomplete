const gulp = require('gulp');
const gulpImports = require('gulp-imports');
const importCss = require('gulp-import-css');
const gutil = require('gulp-util');
const jslint = require('gulp-eslint');
const browserSync = require('browser-sync');
const gulpLoadPlugins = require('gulp-load-plugins');
const $ = gulpLoadPlugins();
const reload = browserSync.reload;
const changed = require('gulp-changed');
const source = require('vinyl-source-stream');
const imagemin = require('gulp-imagemin');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const browserify = require('gulp-browserify');
const w3cValidation = require('gulp-w3c-html-validation');

const serve = 'serve';

const paths = {
    dist: {
        dir:      'dist',
        css:      'dist/css',
        html:     'dist/**/*.html',
        img:      'dist/img',
        video:    'dist/video',
        json:     'dist/json',
        scripts:  'dist/scripts',
        favicons: 'dist/favicons',
        fonts:    'dist/fonts'
    },

    src:     'app',
    libs:    'app/libs',
    html:    'app/*.html',
    images:  'app/img/**/*.{png,jpg,gif,svg}',
    favicon: 'app/img/favicon.png',
    videos:  'app/video/*.{mp4,webm}',
    json:    'app/json/*.json',
    scss:    'app/scss/style.scss',
    scripts: 'app/scripts/main.js',
    fonts:   'app/fonts/*.ttf'
};


gulp.task('styles', function() {
    makeStyles(paths.scss, paths.dist.css, true, true);
});


gulp.task('scripts', function() {
    gulp.src(paths.scripts)
        .pipe(gulpImports())
        .pipe(browserify())
        .pipe(uglify())
        .pipe(gulp.dest(paths.dist.scripts));
    reload();
});


gulp.task('images', function() {
    gulp.src(paths.images)
    .pipe(changed(paths.dist.img))
    .pipe(imagemin({
        optimizationLevel: 3,
        progessive: true,
        interlaced: true
    }))
    .pipe(gulp.dest(paths.dist.img));
});


gulp.task('html', function() {
    gulp.src(paths.html)
        .pipe(changed(paths.dist.dir))
        .pipe(w3cValidation());
});


// Function for styles
function makeStyles(source, destination, isMinify, hasSourceMap) {
    return gulp.src(source)
        .pipe($.plumber())
        .pipe(hasSourceMap ? $.sourcemaps.init() : gutil.noop())
        .pipe($.sass.sync({
            outputStyle: 'expanded',
            precision: 10,
            includePaths: ['.']
        }).on('error', $.sass.logError))
        .pipe(isMinify ? $.cssnano({ zindex: false }) : gutil.noop())
        .pipe($.autoprefixer({browsers: ['> 1%', 'last 2 versions', 'Firefox ESR']}))
        .pipe(hasSourceMap ? $.sourcemaps.write() : gutil.noop())
        .pipe(gulp.dest(destination))
        .pipe(reload({stream: true}));
}


// Gulp tasks
gulp.task(serve, ['styles','scripts','images','html'], function() {
    browserSync({
        notify: false,
        port: 9000,
        server: {
          baseDir: [paths.dist.dir, paths.src]
        }
    });

    gulp.watch([paths.src + '/scripts/**/*.js'],['scripts']);
    gulp.watch([paths.src + '/scss/**/*.scss'], ['styles']);
    gulp.watch([paths.images], ['images']);
    gulp.watch([paths.html], ['html']);

    gulp.watch([paths.src + '/*'], reload);
});
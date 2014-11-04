// define
var gulp = require('gulp');
var config = require('./config.json');

var $ = require('gulp-load-plugins')(
    pattern: ['gulp-*', 'gulp.*'],
    replaceString: /\bgulp[\-.]/
});

var _extend = require('util')._extend,
    browser = require('browser-sync'),
    runSequence = require('run-sequence');

//path
var DEV_PATH = 'dev'
var PUB_PATH = 'public'
var path = {
    pc: {
        html: {
            src_jade: [DEV_PATH + '/etc/**/*.jade',"!" + DEV_PATH + '/etc/**/_*.jade'],
            src_jade_all: [DEV_PATH + '/etc/**/*.jade','./config.json'],
            src: PUB_PATH + '/*.html'
        },
        sass: {
            src: DEV_PATH + '/sass/**/*.scss',
            dest: PRE_PATH + '/css',
            public: PUB_PATH + '/css/**/*.css',
        },
        js: {
            src: DEV_PATH + '/js/**/*.js',
            dest: PUB_PATH + '/js',
            public: PUB_PATH + '/js/**/*.js',
        },
        lib: {
            src: DEV_PATH + '/lib/**/*',
            dest: PUB_PATH + '/lib',
        }
    },
}


// task html
gulp.task('html', function () {
    return gulp.src(path.pc.html.src_ect)
        .pipe($.plumber())
        .pipe($.ect({data: config.ect}))
        .pipe(gulp.dest(PRE_PATH))
        .pipe(browser.reload({stream: true}));
});

// task css
gulp.task('style', function () {
    gulp.src(path.pc.sass.src)
        .pipe($.plumber())
        .pipe($.frontnote({
            title:'Launch! STYLE GUIDE',
            overview:'./README.md',
            out:'./style_guide',
            css:'../preview/css/common.css',
            script:['./preview/lib/jquery-1.11/jquery-1.11.0.js'],
            clean:true,
            //verbose:true
        }))
        .pipe($.sass({
            style:'compressed'
        }))
        .pipe($.autoprefixer(['last 3 version', 'ie >= 8', 'Android 4.0']))
        .pipe(gulp.dest(path.pc.sass.dest))
        .pipe(browser.reload({stream: true}));
});

// task js
gulp.task('js', function(){
    return gulp.src(path.pc.js.src)
        .pipe($.plumber())
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish'))
        .pipe($.jshint.reporter('fail'))
        .pipe(gulp.dest(path.pc.js.dest))
        .pipe(browser.reload({stream: true}));
});

// task lib
gulp.task('lib', function(){
    return gulp.src(path.pc.lib.src)
        .pipe($.plumber())
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish'))
        .pipe($.jshint.reporter('fail'))
        .pipe(gulp.dest(path.pc.lib.dest))
        .pipe(browser.reload({stream: true}));
});


// task clean
gulp.task('clean', function () {
    return gulp.src(path.pc.html.src)
        .pipe($.clean());
});

// task server start
gulp.task('serv', function () {
    browser.init(null, {
        server: {
            baseDir: PRE_PATH
        },
        port : 4000
    });
});

// task server reload
gulp.task('reload', function () {
    browser.reload();
});


// task copy
gulp.task('copy', function() {
  // lib folder
  gulp.src(path.pc.lib.src)
    .pipe(gulp.dest(path.pc.lib.dest));
  // fonts folder
  gulp.src(path.pc.fonts.src)
    .pipe(gulp.dest(path.pc.fonts.dest));
});


// task release
gulp.task('build', function () {
    runSequence('clean',['html','js','lib'],'usemin');
    //fontはそのままコピー
    gulp.src(path.pc.fonts.preview)
        .pipe(gulp.dest(path.pc.fonts.press));

    //cssはそのままコピー
    gulp.src(path.pc.sass.preview)
        .pipe(gulp.dest(path.pc.sass.press));

    //画像はそのままコピー
    gulp.src(path.pc.images.preview)
        .pipe(gulp.dest(path.pc.images.press));
});

// task default
gulp.task('default', ['html','style','js','images','copy','serv'], function () {
    gulp.watch(path.pc.html.src_ect_all,['html']);
    gulp.watch(path.pc.sass.src,['style']);
    gulp.watch(path.pc.js.src,['js']);
    gulp.watch(path.pc.images.src,['images']);
    gulp.watch(path.pc.lib.src,['lib']);
});


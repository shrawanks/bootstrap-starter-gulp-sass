var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var plugins = require('gulp-load-plugins')();
var runSequence = require('run-sequence').use(gulp);
var del = require('delete');
var render = require('gulp-nunjucks-render');
var imageminPngquant = require('imagemin-pngquant');
var imageminZopfli = require('imagemin-zopfli');
var imageminMozjpeg = require('imagemin-mozjpeg'); //need to run 'brew install libpng'
var imageminGiflossy = require('imagemin-giflossy');
var path = require('path');
var config = require('./gulp.config');

 
// console.log(config.node.css)

reload = browserSync.reload;
//delete dist folder
gulp.task('clean:all', function() {
    return del.sync([config.dist.root, config.src.js + 'vendor/']);
});

//delete css folder
gulp.task('clean:css', function() {
    return del.sync([config.dist.css]);
});

//delete data folder
gulp.task('clean:data', function() {
    return del.sync([config.dist.data]);
});

//delete css folder
gulp.task('clean:js', function() {
    return del.sync([config.dist.js, config.src.js + 'vendor/']);
});

//delete html folder
gulp.task('clean:html', function() {
    return del.sync([config.dist.root + '*.html']);
});
//delete html folder
gulp.task('clean:img', function() {
    return del.sync([config.dist.img]);
});

 

//font copy task 
gulp.task('copyfont', function() {
    return gulp.src(config.node.fonts + '*.*')
        .pipe(plugins.plumber({ errorHandler: plugins.notify.onError("Error: <%= error.message %>") }))
        .pipe(gulp.dest(config.dist.fonts))
});
//data copy task 
gulp.task('copydata', function() {
    return gulp.src(config.src.data + '*.*')
        .pipe(plugins.plumber({ errorHandler: plugins.notify.onError("Error: <%= error.message %>") }))
        .pipe(gulp.dest(config.dist.data))
});

//js copy task 
gulp.task('copyjs', function() {
    return gulp.src(config.node.js)
        .pipe(plugins.plumber({ errorHandler: plugins.notify.onError("Error: <%= error.message %>") }))
        .pipe(gulp.dest(config.src.js + 'vendor/'))
});

//js copy task 
gulp.task('js', function() {
    return gulp.src(config.node.js)
        .pipe(plugins.plumber({ errorHandler: plugins.notify.onError("Error: <%= error.message %>") }))
        .pipe(plugins.concat('app.js'))
        .pipe(gulp.dest(config.dist.js))
});

//sass task
gulp.task('scss', function() {
    // console.log('hello');
    return gulp.src(config.src.scss + '*.scss')
        .pipe(plugins.plumber({ errorHandler: plugins.notify.onError("Error: <%= error.message %>") }))
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.sass({
            includePaths: config.node.css,
            // outputStyle: 'compressed'

        }))
        .pipe(plugins.autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        // .pipe(plugins.cssnano())
        .pipe(plugins.sourcemaps.write('.'))
        .pipe(gulp.dest(config.dist.css))
        .pipe(plugins.notify({ message: "Sass files successfully compiled.", onLast: true }))
        .pipe(browserSync.reload({
            stream: true
        }))
});

 
 


//html task 
// gulp.task('html', function(){
//  return gulp
//      .src('src/html/*.html')
//      .pipe(plugins.injectPartials())
//      .pipe(plugins.useref())
//      //.pipe(plugins.if('*.css', plugins.cssnano()))
//      // .pipe(plugins.if('*.js', plugins.uglify()))
//      .pipe(gulp.dest(config.distHtml))
//      .pipe(plugins.notify({ message: "html task successfully completed.", onLast: true }));
// });


gulp.task('nunjucks', function() {
    return gulp.src(config.src.root + '*.html')
     .pipe(plugins.newer(config.dist.root+'*.html'))
        .pipe(plugins.plumber({ errorHandler: plugins.notify.onError("Error: <%= error.message %>") }))
        .pipe(render({
            path: [config.src.root]
        }))
        // .pipe(plugins.useref())
        // .pipe(plugins.if('*.js', plugins.uglify()))
        // .pipe(plugins.versionNumber(versionConfig))
        .pipe(gulp.dest(config.dist.root))
        .pipe(plugins.notify({ message: "nunjucks files successfully compiled to html.", onLast: true }))

});

gulp.task('imagemin', function() {
    return gulp.src(config.src.img + '**/*')
         .pipe(plugins.newer(config.dist.img))
        .pipe(plugins.plumber({ errorHandler: plugins.notify.onError("Error: <%= error.message %>") }))

        .pipe(plugins.imagemin([
            //png
            imageminPngquant({
                speed: 1,
                quality: 98 //lossy settings
            }),
            imageminZopfli({
                more: true
            }),
            //gif
            // imagemin.gifsicle({
            //     interlaced: true,
            //     optimizationLevel: 3
            // }),
            //gif very light lossy, use only one of gifsicle or Giflossy
            imageminGiflossy({
                optimizationLevel: 3,
                optimize: 3, //keep-empty: Preserve empty transparent frames
                lossy: 2
            }),
            //svg
            plugins.imagemin.svgo({
                plugins: [{
                    removeViewBox: false
                }]
            }),
            //jpg lossless
            plugins.imagemin.jpegtran({
                progressive: true
            }),
            //jpg very light lossy, use vs jpegtran
            imageminMozjpeg({
                quality: 90
            })
        ]))
        .pipe(gulp.dest(config.dist.img))
        .pipe(plugins.notify({ message: "Image task successfully completed.", onLast: true }));
});



//browser sync
gulp.task('serve',  function() {
    browserSync.init({
        server: {
            baseDir: config.dist.root
        },
        browser: "chrome",



    });
    gulp.watch(config.src.scss+'**/*.scss', ['scss']);
    gulp.watch(config.src.js + '**/*', ['js']).on('change', reload);
    gulp.watch(config.src.img + '**/*', ['imagemin']).on('change', reload);
    gulp.watch(config.src.root + '**/*.html', ['nunjucks']).on('change', reload);
    // gulp.watch(config.src.data+'**/*', ['copydata']).on('change', reload);




});

// images task
// gulp.task('images',  function(){
//  return gulp.src(config.srcImg+'**/*')
//      .pipe(plugins.newer(config.distImg))
//      .pipe(plugins.imagemin([
//          plugins.imagemin.gifsicle({interlaced: true}),
//          plugins.imagemin.jpegtran({progressive: true}),
//          plugins.imagemin.optipng({optimizationLevel: 5}),
//          plugins.imagemin.svgo({plugins: [{removeViewBox: true}]})
//      ]))
//      .pipe(gulp.dest(config.distImg))
//      .pipe(plugins.notify({ message: "Image task successfully completed.", onLast: true }));

// });
//add/delete function
function abc(event) {
    console.log('changed', event)
    if (event.type === 'deleted') {
        // Simulating the {base: 'src'} used with gulp.src in the scripts task
        var filePathFromSrc = path.relative(path.resolve(config.src.root), event.path);

        // Concatenating the 'build' absolute path used by gulp.dest in the scripts task
        var destFilePath = path.resolve(config.dist.root, filePathFromSrc);

        del.sync(destFilePath);
    }
}

// watch files
gulp.task('watch', ['serve'], function() {
    gulp.watch(config.src.scss + '**/*.scss', ['scss']);
    gulp.watch(config.src.js + '**/*', ['js']).on('change', reload);
    gulp.watch(config.src.img + '**/*', ['imagemin']).on('change', reload);
    gulp.watch(config.src.root + '**/*.html', ['nunjucks']).on('change', reload);


});

gulp.task('default', ['clean:all'], function() {
    runSequence('copyfont', 'copydata', 'scss', 'js', 'nunjucks', 'imagemin',   'serve');
});
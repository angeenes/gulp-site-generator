// TODO Add KSS for the styleguide
// TODO module the js with import/export es6

//////////////////////////////////////////////////////////////////////////////////////////////////////////
// Gulp task runner to buil html pages & a styleguide using Assemble with Handlebars template engine
/////////////////////////////////////////////////////////////////////////////////////////////////////////

const gulp = require('gulp');
const assemble = require('assemble');
const handle = require('assemble-handle');
const helpers = require('handlebars-helpers');
const handlebars = require('handlebars');
// const yaml = require('helper-yaml');
const htmlmin = require('gulp-htmlmin');
const extname = require('gulp-extname');
const stylus = require('gulp-stylus');
const bootstrap = require('bootstrap-styl');
const nib = require('nib');
const babel = require("gulp-babel");
const uglify = require('gulp-uglify');
const stylish = require('jshint-stylish');
const jshint = require('gulp-jshint');
const eslint = require('gulp-eslint');
const sourcemaps = require("gulp-sourcemaps");
const concat = require("gulp-concat");
const gulpif = require('gulp-if');
// const pump = require('pump');// *pump to callback node errors to terminal
const iconfont = require('gulp-iconfont');
const iconfontCss = require('gulp-iconfont-css');
const cssmin = require('gulp-cssmin');
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');
const del = require('del');
const runSequence = require('run-sequence');
const rename = require("gulp-rename");
const argv = require('yargs').argv;
const browserSync = require('browser-sync').create();
const kss = require('kss');

////////////////////////////
// Path default variables
///////////////////////////

const filePath = {
  dist_dir: './.dist',
  dist: {
            src: 'src/templates',
            partials: 'src/templates/components/{,**/}*.hbs',
            layouts: 'src/templates/layouts/*.hbs',
            pages: 'src/templates/pages/*.hbs',
            defaultLayout: 'src/templates/layouts/default.hbs',
            dest: 'dist/',
            stylMain: 'src/assets/stylus/main.styl',
            stylComponents: 'src/templates/components/components.styl',
            cssOutput: 'dist/css',
            BrowseIndex: 'index.html'
          },
  styleguide: {
            src: 'src/styleguide/',
            partials: ['src/templates/components/{,**/}*.hbs', 'src/styleguide/partials/*.hbs'],
            layouts: 'src/styleguide/layouts/*.hbs',
            pages: 'src/styleguide/pages/*.hbs',
            atoms: 'src/styleguide/components/atoms/**/*.hbs',
            molecules: 'src/styleguide/components/molecules/**/*.hbs',
            organisms: 'src/styleguide/components/organisms/**/*.hbs',
            defaultLayout: 'src/styleguide/layouts/default.hbs',
            dest: 'dist/styleguide',
            styl: 'src/styleguide-builder/kss-assets/kss.styl',
            cssOutput: 'src/styleguide-builder/kss-assets/',
            BrowseIndex: '/styleguide/index.html'
          }
};

////////////////////////////////////////////
// Begin HTML pages Assemble Script Tasks
///////////////////////////////////////////

// Assemble hbs blocs to html preview site pages or styleguide
const app = assemble();
// const code = helpers.code();
// const logging = helpers.logging();
// const object = helpers.object();
// const path = helpers.path();
gulp.task('load', (cb) => {
    var $src = (argv.styleguide === true) ? filePath.styleguide : filePath.dist ;
    app.partials($src.partials);
    app.layouts($src.layouts);
    app.pages($src.pages);
    app.option('layout', $src.defaultLayout);
    // app.option('helpers','node_modules/handlebars/lib/handlebars/helpers/**.js');
    // app.asyncHelper('yaml', yaml);
    // app.helper('stringify', function (o) {return JSON.stringify(o);});
    // app.helpers({yaml: require('helper-yaml')});
    // app.path ("hjehejej")
    // app.data('src/data/*.yaml');
    // app.helper( 'test', options => options.data.root ); // add a custom helper
    // app.helpers({markdown: require('helper-markdown')}); // load a specific helper
    // app.helpers({filename: require('helper-filename')}); // load a specific helper
    // console.log(app.helpers);
    cb();
});

gulp.task('assemble', ['load'], () => {
  return app.toStream('pages')
      .pipe(handle(app, 'handlerName'))
      .pipe(app.renderFile())
      .pipe(htmlmin())
      .pipe(extname())
      .pipe(app.dest(filePath.dist.dest));
});

///////////////////////////////////////
// Begin SVG to ICOFONTS Script Tasks
///////////////////////////////////////

// ***ICONS FONT*** Create css for icons font ant then create ico font files
const fontName = 'icons';
gulp.task('icofont', () => {
    return gulp.src(['src/assets/icons/*.svg'])
        .pipe(iconfontCss({
            fontName: fontName.toLowerCase(),
            // path: 'src/assets/css/templates/_icons.css',
            targetPath: '../css/icons.css',
            fontPath: '../../fonts/'
        }))
        .pipe(cssmin())
        .pipe(iconfont({
            fontName: fontName,
            formats: ['ttf', 'eot', 'woff', 'woff2'],
            appendCodepoints: true,
            appendUnicode: false,
            normalize: true,
            fontHeight: 1000,
            centerHorizontally: true
        }))
        .pipe(gulp.dest('dist/fonts/'))
});

////////////////////////////
// Begin CSS Tasks
////////////////////////////

gulp.task('style-dist', () => {
    const options = {
        compress: true,
        use: [nib(),bootstrap()]
    };
    // return gulp.src( [filePath.dist.stylMain, filePath.dist.stylComponents ] )
    return gulp.src(filePath.dist.stylMain)
      .pipe(sourcemaps.init())
      .pipe(stylus(options))
      .pipe(sourcemaps.write('.'))
      // .pipe(rename({suffix: '.min'}))
      .pipe(concat("style.min.css"))
      .pipe(gulp.dest(filePath.dist.cssOutput))
});

gulp.task('style-styleguide', () => {
    const options = {
        compress: true,
        use: [nib(),bootstrap()]
    };
    // return gulp.src( [filePath.dist.stylMain, filePath.dist.stylComponents ] )
    return gulp.src(filePath.styleguide.styl)
      .pipe(sourcemaps.init())
      .pipe(stylus(options))
      .pipe(sourcemaps.write('.'))
      // .pipe(rename({suffix: '.min'}))
      .pipe(concat("kss.css"))
      .pipe(gulp.dest(filePath.styleguide.cssOutput))
});

// Concat icons + website style in one main css file
gulp.task('concat-style', () => {
  return gulp.src(['dist/css/style.min.css', 'dist/css/icons.css'])
    .pipe(concat({ path: 'main.min.css'}))
    .pipe(gulp.dest('./dist/css'))
    .pipe(browserSync.stream());
});

// delete useless css files in dist folder
gulp.task('clean-styles', () => {
  console.log("CLEAN STYLES");
  return del(['dist/css/style.min.css','dist/css/icons.css'])
})

//////////////////////////////////
// Begin JAVASCRIPT Script Tasks
//////////////////////////////////

// ***JS*** Uglify to js compres
gulp.task('uglify', () => {
    const options = {
        mangle: true
    };
    return gulp.src('src/assets/js/*.js')
      .pipe(sourcemaps.init())
      .pipe(babel())
      .pipe(uglify(options))
      .pipe(rename({suffix: '.min'}))
        // concat("all.js"),
      .pipe(sourcemaps.write("."))
      .pipe(gulp.dest('dist/js'))

});

gulp.task('lint', () => {
  return gulp.src([
      'src/assets/js/*.js'
    ])
    .pipe(jshint())
    .pipe(jshint.reporter(stylish))
});

//////////////////
// Copy tasks // if needed
//////////////////

// a DIY copy task, no need for a plugin with Gulp!
// gulp.task('copy-images', function() {
//   gulp.src('src/assets/images/*.*')
//   .pipe(gulp.dest('dist/images/'));
// });


/////////////////////////
// Images optimisation
/////////////////////////

// image optimisation usingpngquant for better optimization
gulp.task('image-min', () => {
    return gulp.src('src/assets/images/*.{png,jpg,gif,svg}')
        .pipe(imagemin({
        progressive: true,
        use: [pngquant()]
        }))
      .pipe(gulp.dest('dist/images'))
});

/////////////////////////
// Clean folder
/////////////////////////

// start with a clean 'dist' folder
gulp.task('clean', () => {
  console.log('deleted folder : ',filePath.dist.dest);
    return del(filePath.dist.dest);
});

/////////////////////////
// Generate styleguide
/////////////////////////

// kss
gulp.task('kss', () => {
    // generate doc
    kss(require('./kss.json'));
    // retrieve dist directory
    return gulp.src(filePath.dist.dest)
        .pipe(gulp.dest(filePath.styleguide.dest));

});

/////////////////////////////////////////////////////
// Local Node SERVER Script Tasks with WATCH tasks
/////////////////////////////////////////////////////

// *** PAGES PREVIEW ** Static server
gulp.task('browser-sync', () => {
  var $path = (argv.styleguide === true) ? filePath.styleguide : filePath.dist ;
    browserSync.init({
        server: {
            baseDir: "dist/",
            index: $path.BrowseIndex,
            routes: {"/": $path.dest},
            // directory: true,
            failOnEmptyTestSuite: true,
            logConnections: true
        }
    });
    gulp.watch("src/assets/js/*.js", ['uglify']).on('change', function (event) {
        console.log("modified js file is :", event.path)
      });
    gulp.watch(["src/templates/**/*.hbs","src/styleguide/**/*.hbs"], ['assemble']).on('change', function (event) {
        console.log("modified hbs file is :", event.path)
      });
    gulp.watch(["src/assets/stylus/*.styl", "src/templates/components/**/*.styl", "src/styleguide/assets/stylus/*.styl"], ['style']).on('change', function (event) {
            console.log("modified styl file is :", event.path)
      }); // css is injected into stream with stylus task
    gulp.watch(["src/assets/images/*.*"], ['image-min']).on('change', function (event) {
        console.log("modified image file :", event.path)
      });
    gulp.watch(["src/assets/icons/*.*"], ['style']).on('change', function (event) {
          console.log("New icon(s) generated", event.path)
        });
    gulp.watch(["src/styleguide-builder/kss-assets/kss.styl", "src/templates/components/**/**"], ['styleguide']).on('change', function (event) {
          console.log("styleguide css changed", event.path)
        });
    gulp.watch(["dist/*.html","dist/styleguide/*.html", "dist/js/*.js"]).on('change', browserSync.reload);
});

/////////////////////////////////////////////////////
// Gulp tasks execution
/////////////////////////////////////////////////////

// gulp or gulp --styleguide
gulp.task('default', (done) => {runSequence(['style','assemble','image-min','uglify'], 'lint', 'browser-sync', done);});

// tasks to generate css files
gulp.task('style', (done) => {runSequence(['icofont', 'style-dist'],'concat-style','clean-styles', done);});

// task to generate the styleguide
gulp.task('styleguide',(done) => {runSequence(['style', 'style-styleguide', 'kss'], 'browser-sync', done);});

// Run the local server to preview the website pages, after a dist build
gulp.task('serve', ['browser-sync']);

// gulp clean to delete dist folder
gulp.task('clean-dist', ['clean']);

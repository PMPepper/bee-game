//TODO set up error notifications
//TODO code linting
//TODO delete output directories before writing new files


const gulp = require('gulp');
const path = require('path');
const runSequence = require('run-sequence');
const webpack = require('webpack-stream');
require('script-loader');
require('json-loader');
const minify = require('gulp-minify');
const sass = require('gulp-sass');
const nunjucks = require('gulp-nunjucks');
const filter = require('gulp-filter');
const data = require('gulp-data');
const browserSync = require('browser-sync').create();
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const cssnano = require('gulp-cssnano');
const directoryMap = require("gulp-directory-map");
const del = require('del');
const notify = require("gulp-notify");
const plumber = require("gulp-plumber");

const config = {
  devOutputPath:'develop',
  buildOutputPath:'build',
  autoprefixer: {
    browsers: ['last 2 versions']
  },
  sass: {
    includePaths: ['node_modules', 'bower_components']
  },
  cssnano: {
    dev: {},
    build: {}
  }
};

const npmConfig = require('./package.json');


config.css = {
  devOutputPath: config.devOutputPath + '/css',
  buildOutputPath: config.buildOutputPath + '/css',
  watch: ['scss/**/*.+(css|scss)'],
  src: 'scss/**/*.+(css|scss)',
  devSourcemaps: {
    enabled: true
  },
  buildSourcemaps: {
    enabled: false
  }
};

config.html = {
  devOutputPath: config.devOutputPath + '/html',
  buildOutputPath: config.buildOutputPath + '/html',
  watch: ['html/**/+(data.json|*.+(html|nunjucks))'],
  src: 'html/**/*.html',
  nunjucks: {
    enabled: true,
    dataFile: './html/data'
  },
  devSourcemaps: {
    enabled: true
  },
  buildSourcemaps: {
    enabled: false
  }
};

config.images = {
  devOutputPath: config.devOutputPath + '/images',
  buildOutputPath: config.buildOutputPath + '/images',
  watch: ['images/**/*.+(jpg|jpeg|png|gif)'],
  src: 'images/**/*.+(jpg|jpeg|png|gif)',
  mapOptions: {
    filename: 'images.json',
    path: 'images'
  }
};

config.js = {
  devOutputPath: config.devOutputPath + '/js',
  buildOutputPath: config.buildOutputPath + '/js',
  watch: ['js/**/*.+(js|json|jsx)', config.images.mapOptions.path+'/'+config.images.mapOptions.filename],
  entry: npmConfig.main,//used by webpack, instead of src
  devSourcemaps: {
    enabled: true
  },
  buildSourcemaps: {
    enabled: false //TODO make this work (need to use filter before uglify?)
  }
};

config.notify = {
  js: 'Error: <%= error.message %>'
};

config.plumber = {
  js: {
    errorHandler: notify.onError(config.notify.js)
  }
};

config.uglify = {
  build: {}
};

config.browserSync = {
    server: {
        baseDir: "./"+config.devOutputPath
    },
    startPath: 'html/'
};

var phaserModule = path.join(__dirname, '/bower_components/phaser/')

config.webpack = {
  dev: {
    devtool: 'source-map',
    output: {
        path: __dirname + "/"+config.js.devOutputPath,
        filename: "scripts.js"
    },
    module: {
      loaders: [
        {
          test: /.*.json/,
          loader: 'json'
        },
        {
          test: /pixi.js/,
          loader: 'script'
        },
        {
          test: /\.js$/,
          exclude: /(node_modules|bower_components)/,
          loader: 'babel-loader',
          query: {
            presets: ['es2017', 'react'],
            plugins: ['transform-runtime']
          }
        },
        {
          test : /\.jsx$/,
          exclude: /(node_modules|bower_components)/,
          loader: 'babel-loader',
          query: {
            presets: ['es2017', 'react'],
            plugins: ['transform-runtime']
          }
        }
      ]
    },
    resolve: {
      alias: {
          'phaser': path.join(phaserModule, 'build/custom/phaser-split.js'),
          'pixi.js': path.join(phaserModule, 'build/custom/pixi.js'),
          'p2': path.join(phaserModule, 'build/custom/p2.js'),
      }
    }
  },
  build: {
    devtool: (config.js.buildSourcemaps.enabled ? 'source-map' : null),
    output: {
        path: __dirname + "/"+config.js.buildOutputPath,
        filename: "scripts.js"
    },
    module: {
      loaders: [
        {
          test: /.*.json/,
          loader: 'json'
        },
        {
          test: /pixi.js/,
          loader: 'script'
        },
        {
          test: /\.js$/,
          exclude: /(node_modules|bower_components)/,
          loader: 'babel-loader',
          query: {
            presets: ['es2017', 'react'],
            plugins: ['transform-runtime']
          }
        },
        {
          test : /\.jsx$/,
          exclude: /(node_modules|bower_components)/,
          loader: 'babel-loader',
          query: {
            presets: ['es2017', 'react'],
            plugins: ['transform-runtime']
          }
        }
      ]
    },
    resolve: {
      alias: {
          'phaser': path.join(phaserModule, 'build/custom/phaser-split.js'),
          'pixi.js': path.join(phaserModule, 'build/custom/pixi.js'),
          'p2': path.join(phaserModule, 'build/custom/p2.js'),
      }
    }
  }
};

var isBrowserSync = false;

//General functions
function gulpJsSrc() {
  return gulp.src(config.js.entry);
}

function gulpCssSrc() {
  return gulp.src(config.css.src);
}

function gulpHtmlSrc() {
  return gulp.src(config.html.src);
}

function gulpImagesSrc() {
  return gulp.src(config.images.src);
}

//Define tasks

//-JS tasks
gulp.task('js-dev', ['js-clean-dev'], () => {
  return gulpJsSrc()
    .pipe(plumber(config.plumber.js))
    .pipe(config.js.devSourcemaps.enabled ? sourcemaps.init(config.js.devSourcemaps.options) : filter(['**/*']))
    .pipe(webpack(config.webpack.dev))
    .pipe(config.js.devSourcemaps.enabled ? sourcemaps.write(config.js.devSourcemaps.path, config.js.devSourcemaps.writeOptions) : filter(['**/*']))
    .pipe(gulp.dest(config.js.devOutputPath+'/'));
});

gulp.task('js-watch', ['js-dev'], () => {
  return gulp.watch(config.js.watch, () => {
    runSequence('js-dev', 'dev-server-refresh');
  });
});

gulp.task('js-build', ['js-clean-build'], function() {
  return gulpJsSrc()
    .pipe(plumber(config.plumber.js))
    .pipe(config.js.buildSourcemaps.enabled ? sourcemaps.init(config.js.buildSourcemaps.options) : filter(['**/*']))
    .pipe(webpack(config.webpack.build))
    .pipe(uglify(config.uglify.build))
    .pipe(config.js.buildSourcemaps.enabled ? sourcemaps.write(config.js.buildSourcemaps.path, config.js.buildSourcemaps.writeOptions) : filter(['**/*']))
    .pipe(gulp.dest(config.js.buildOutputPath+'/'));
});

gulp.task('js-clean-dev', (done) => {
  del([config.js.devOutputPath]).then(() => {done()});
});

gulp.task('js-clean-build', (done) => {
  del([config.js.buildOutputPath]).then(() => {done()});
});

//-CSS tasks
function cssDev() {
  return gulpCssSrc()
    .pipe(config.css.devSourcemaps.enabled ? sourcemaps.init(config.css.devSourcemaps.options) : filter(['**/*']))
    .pipe(sass(config.sass))
    .pipe(autoprefixer(config.autoprefixer))
    .pipe(config.css.devSourcemaps.enabled ? sourcemaps.write(config.css.devSourcemaps.path, config.css.devSourcemaps.writeOptions) : filter(['**/*']))
    .pipe(gulp.dest(config.css.devOutputPath+'/'));
}

gulp.task('css-dev', ['css-clean-dev'], function() {
  return cssDev();
});

gulp.task('css-watch', ['css-dev'], () => {
  return gulp.watch(config.css.watch, () => {
    return isBrowserSync ? cssDev().pipe(browserSync.stream()) : cssDev();
  });
});

gulp.task('css-build', ['css-clean-build'], function() {
  return gulpCssSrc()
    .pipe(config.css.buildSourcemaps.enabled ? sourcemaps.init(config.css.buildSourcemaps.options) : filter(['**/*']))
    .pipe(sass(config.sass))
    .pipe(autoprefixer(config.autoprefixer))
    .pipe(cssnano(config.cssnano.build))
    .pipe(config.css.buildSourcemaps.enabled ? sourcemaps.write(config.css.buildSourcemaps.path, config.css.devSourcemaps.writeOptions) : filter(['**/*']))
    .pipe(gulp.dest(config.css.buildOutputPath+'/'));
});

gulp.task('css-clean-dev', (done) => {
  del([config.css.devOutputPath]).then(() => {done()});
});

gulp.task('css-clean-build', (done) => {
  del([config.css.buildOutputPath]).then(() => {done()});
});


//-HTML tasks
function html() {
  var pipe = gulpHtmlSrc();

  if(config.html.nunjucks.enabled) {
    pipe = pipe
      .pipe(data(() => {
        //need to delete cache entry so that changes actually get applied
        delete require.cache[require.resolve(config.html.nunjucks.dataFile)]
        return require(config.html.nunjucks.dataFile);
      }))
      .pipe(nunjucks.compile(config.html.nunjucks));
  }

  return pipe;
}

gulp.task('html-dev', ['html-clean-dev'], function() {
  return html().pipe(gulp.dest(config.html.devOutputPath+'/'));
});

gulp.task('html-watch', ['html-dev'], () => {
  return gulp.watch(config.html.watch, () => {
    runSequence('html-dev', 'dev-server-refresh');
  });
});

gulp.task('html-build', ['html-clean-build'], () => {
  return html().pipe(gulp.dest(config.html.buildOutputPath+'/'));
});

gulp.task('html-clean-dev', (done) => {
  del([config.html.devOutputPath]).then(() => {done()});
});

gulp.task('html-clean-build', (done) => {
  del([config.html.buildOutputPath]).then(() => {done()});
});

//TODO image tasks
gulp.task('images-dev', ['images-clean-dev', 'images-map'], () => {
  return gulpImagesSrc()
    .pipe(gulp.dest(config.images.devOutputPath+'/'))
});

gulp.task('images-watch', () => {
  return gulp.watch(config.images.watch, () => {
    runSequence('images-dev', 'dev-server-refresh');
  });
});

gulp.task('images-build', ['images-clean-build', 'images-map'], () => {
  return gulpImagesSrc()
    .pipe(gulp.dest(config.images.buildOutputPath+'/'));
});

gulp.task('images-clean-dev', (done) => {
  del([config.images.devOutputPath]).then(() => {done()});
});

gulp.task('images-clean-build', (done) => {
  del([config.images.buildOutputPath]).then(() => {done()});
});

gulp.task('images-map', (cb) => {
  //del.sync([config.images.mapOptions.path+'/'+config.images.mapOptions.filename]);

  /*return gulpImagesSrc()
    .pipe(directoryMap(config.images.mapOptions))
    .pipe(gulp.dest(config.images.mapOptions.path+'/'));*/

    cb();
});

//General tasks
const devTasks =    ['images-dev', ['js-dev', 'css-dev', 'html-dev']];
const buildTasks =  ['images-build', ['js-build', 'css-build', 'html-build']];
const watchTasks =  [['images-watch','js-watch', 'css-watch', 'html-watch']];

//A one-off dev build
gulp.task('dev', (done) => {
  runSequence.apply(null, devTasks.concat(done));
});

//run a dev build, then watch for future changes & continue dev building
gulp.task('watch', () => {
  runSequence.apply(null, watchTasks);
});

//like watch, but also runs a development web server with browserSync
gulp.task('dev-server', ['dev'], () => {
  browserSync.init(config.browserSync);
  isBrowserSync = true;
  runSequence('watch');
});

//Needed for internal use only
gulp.task('dev-server-refresh', (done) => {
  if(isBrowserSync) {
    browserSync.reload();
  }
  done();
});

//A one-off full build
gulp.task('build', (done) => {
  runSequence.apply(null, buildTasks.concat(done));
});

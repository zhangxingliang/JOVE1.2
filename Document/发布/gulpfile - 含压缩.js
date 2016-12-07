var gulp = require('gulp');
var assetRev = require('gulp-asset-rev');
var stripDebug = require('gulp-strip-debug');
var uglify = require('gulp-uglify');
var autoprefix = require('gulp-autoprefixer');
//var minifyCSS = require('gulp-minify-css');
var cleanCSS = require('gulp-clean-css');

gulp.task('asset',function() {
	//requireJS 加版本号
    gulp.src("./Jove/app/*.js")
        .pipe(assetRev({
			requireJSPaths:['./lib/js',
						'./controllers',
						'./directives',
						'./services',
						'./h5',
						'./',
						'./h5/template'],
			requireJSConfig:'main.js'
			}))
        .pipe(gulp.dest('./Jove/app/'));
		
		//index.cshtml加版本号
    gulp.src("./Jove/Views/Home/*.cshtml")
        .pipe(assetRev({rootPath:'./Jove'}))
        .pipe(gulp.dest('./Jove/Views/Home/'));
});

gulp.task('scripts', function() {
  gulp.src(['./Jove/app/**/*.js'])
    //.pipe(concat('all.js'))
    .pipe(stripDebug())
    .pipe(uglify())
    .pipe(gulp.dest('./Jove/app/'));
});


// CSS concat, auto-prefix and minify
gulp.task('styles', function() {
  gulp.src(['./Jove/app/css/*.css'])
    //.pipe(concat('styles.css'))
    .pipe(autoprefix('last 2 versions'))
    .pipe(cleanCSS())
    .pipe(gulp.dest('./Jove/app/css/'));
});

// default gulp task
gulp.task('default', ['asset','scripts', 'styles'], function() {   
});

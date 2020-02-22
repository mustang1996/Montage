var syntax        = 'sass', // Syntax: sass or scss;
		gulpversion   = '4'; // Gulp version: 3 or 4


var gulp          = require('gulp'),
	del           = require('del'),
	imagemin      = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    mozjpeg = require('imagemin-mozjpeg'),
	sass          = require('gulp-sass'),
	browserSync   = require('browser-sync'),
	concat        = require('gulp-concat'),
	uglify        = require('gulp-uglify'),
	cleancss      = require('gulp-clean-css'),
	rename        = require('gulp-rename'),
	autoprefixer  = require('gulp-autoprefixer'),
	notify        = require('gulp-notify'),
	cache         = require('gulp-cache');

gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: 'app'
		},
		notify: false,
		// open: false,
		// online: false, // Work Offline Without Internet Connection
		// tunnel: true, tunnel: "projectname", // Demonstration page: http://projectname.localtunnel.me
	})
});

gulp.task('css-min', function() {
	return gulp.src(['app/css/**/*.css'])
		.pipe(cleancss( {format: 'keep-breaks', level: { 2: { specialComments: 0 } } }))
		.pipe(gulp.dest('app/css'))
});

var options = {
	compress: {
		inline: false
	}
};
gulp.task('min', function() {
	return gulp.src(['app/min/**/*.js'])
		.pipe(uglify(options))
		.pipe(gulp.dest('app/js/min/'))
});

gulp.task('sass', function() {
	return gulp.src('app/sass/**/*.sass')
	.pipe(sass({outputStyle: 'expand'}).on("error", notify.onError()))
	.pipe(autoprefixer(['last 15 versions']))
	// .pipe(cleancss( {level: { 1: { specialComments: 0 } } })) // Opt., comment out when debugging
	.pipe(gulp.dest('app/css'))
	.pipe(browserSync.stream())
});
gulp.task('critical',gulp.series('sass'), function() {
	return gulp.src(['app/css/critical.css'/*,'app/css/breadcrumbs_critical.css'*/])
		.pipe(concat('critical.css'))
		.pipe(browserSync.stream())
});
gulp.task('css',gulp.series('critical'), function() {
	return gulp.src(['app/css/main.css'/*,'app/css/breadcrumbs.css','app/css/slider.css'*/])
		.pipe(concat('main.css'))
		.pipe(browserSync.stream())
});

gulp.task('js', function() {
	return gulp.src('app/js/*.js')
	.pipe(browserSync.stream())
});


gulp.task('js-lib', function() {
	return gulp.src([
		'app/libs/jquery/dist/jquery.min.js',
		'app/libs/jQuery.mmenu/dist/jquery.mmenu.all.js',
		'app/libs/fancybox/dist/jquery.fancybox.min.js',
		'app/libs/owl.carousel/dist/owl.carousel.min.js',
		'app/libs/Waves/dist/waves.min.js',
		'app/libs/waypoints/lib/jquery.waypoints.min.js',
		// 'app/libs/parallax/parallax.min.js',
		'app/libs/jquery.maskedinput/dist/jquery.maskedinput.min.js',
		'app/libs/sweetalert/sweetalert2.all.min.js',
		])
	.pipe(gulp.dest('app/libs/js'))
	.pipe(browserSync.stream())
});

gulp.task('css-lib', function() {
	return gulp.src([
		'app/libs/jQuery.mmenu/dist/jquery.mmenu.all.css',
		'app/libs/fancybox/dist/jquery.fancybox.min.css',
		'app/libs/owl.carousel/dist/assets/owl.carousel.min.css',
		'app/libs/Waves/dist/waves.min.css',
		])
	.pipe(gulp.dest('app/libs/css'))
	.pipe(browserSync.stream())
});

gulp.task('code', function() {
	return gulp.src('app/*.html')
	.pipe(browserSync.stream())
});

gulp.task('imagemin', function() {
    return gulp.src('app/img/**/*')
        .pipe((imagemin([
            pngquant(),
            mozjpeg({
                progressive: true
            })
        ],{
            verbose: true
        })))
        .pipe(gulp.dest('dist/img'));
});

function dest_css(argument) {
	return gulp.src([
		'app/css/*'
		]).pipe(gulp.dest('dist/css'));
}
function dest_js(argument) {
	return gulp.src([
		'app/js/*'
		]).pipe(gulp.dest('dist/js'));
}
function dest_libs(argument) {
	return gulp.src([
		'app/libs/css*/*',
		'app/libs/js*/*'
		]).pipe(gulp.dest('dist/libs'));
}
function dest_code(argument) {
	return gulp.src([
		'app/*.html'
		]).pipe(gulp.dest('dist'));
}

function dest_fonts(argument) {
	return gulp.src([
		'app/fonts/**/*'
		]).pipe(gulp.dest('dist/fonts'));
}

gulp.task('dest', gulp.parallel(dest_css,dest_js,dest_libs,dest_code,dest_fonts));



gulp.task('removedist', function() { return del('dist'); });
gulp.task('removelibs', function() { return del([
	'app/libs/js',
	'app/libs/css'
])});

gulp.task('build', gulp.series('removedist', 'removelibs', 'imagemin', 'css', 'css-min', 'js-lib', 'css-lib','dest'));


if (gulpversion == 4) {
	gulp.task('watch',  function() {
		gulp.watch('app/'+syntax+'/**/*.'+syntax+'', gulp.parallel('css'));
		gulp.watch(['libs/**/*.js'], gulp.parallel('js-lib'));
		gulp.watch(['libs/**/*.css'], gulp.parallel('css-lib'));
		gulp.watch(['app/js/*.js'], gulp.parallel('js'));
		gulp.watch('app/*.html', gulp.parallel('code'))
	});
	gulp.task('default', gulp.series('removelibs', gulp.parallel('watch','browser-sync', 'css', 'js-lib', 'css-lib')) );
}

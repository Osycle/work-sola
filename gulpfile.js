


var gulp 						= require('gulp');
var del							= require('del');
var browserSync 		= require('browser-sync');
var sass 						= require('gulp-sass');
var concat					= require('gulp-concat');
var uglify					= require('gulp-uglifyjs');
var cssnano					= require('gulp-cssnano');
var rename					= require('gulp-rename');
var autoprefixer		= require('gulp-autoprefixer');
var deleteEmpty 		= require('delete-empty');


var fileinclude = require('gulp-file-include');

var app = "app";


// // CLEAN DIR
// gulp.task('clean', () =>
// 	{ return del.sync( 'dist' ); }
// )
// CLEAR
// gulp.task('clear', () => 
// 	{
// 		return cache.clearAll();
// 	} 
// )


gulp.task('img', function () {
	del.sync( './dist/img/**/*' );
	deleteEmpty.sync('dist/**/*');
	return gulp.src('app/img/**/*').pipe( gulp.dest( 'dist/img/' ) )
})
gulp.task('fonts', function () {
	del.sync( './dist/fonts/**/*' );
	deleteEmpty.sync('dist/**/*');
	return gulp.src('app/fonts/**/*').pipe( gulp.dest( 'dist/fonts/' ) )
})
gulp.task('files', function () {
	del.sync( './dist/files/**/*' );
	deleteEmpty.sync('dist/**/*');
	return gulp.src('app/files/**/*').pipe( gulp.dest( 'dist/files/' ) )
})
gulp.task('js', function () {
	del.sync( './dist/js/**/*' )
	deleteEmpty.sync('dist/**/*');
	return gulp.src('app/js/**/*').pipe( gulp.dest( 'dist/js/' ) )
})

gulp.task('fileinclude', function() {
	del.sync([
		'./dist/**', 
		'!./dist/js/**', 
		'!./dist/img/**', 
		'!./dist/files/**', 
		'!./dist/fonts/**', 
		'!./dist/css/**'
	]);
	deleteEmpty.sync('dist/**/*');
	gulp.src(['./app/src/**/*', '!./app/src/**/*.html']).pipe( gulp.dest( 'dist/' ) )
	//gulp.src('app/src/**/*.css').pipe( gulp.dest( 'dist/' ) )
  return gulp.src(['./app/src/**/*.html', '!./app/src/**/_*.html'])	
    .pipe(fileinclude({
      prefix: '@@',
      basepath: './'
    }))
    .pipe(gulp.dest('./dist/'))
    .pipe( browserSync.reload({stream:true}) )
    
});



// SASS
gulp.task('sass', (done)=>{
		gulp
			.src( 'app/scss/**/*.+(scss|sass)')
			.pipe( sass().on('error', sass.logError) )
			.pipe(autoprefixer({overrideBrowserslist: 'last 2 versions', cascade: false} ))
			.pipe( gulp.dest('dist/css/') )
			.pipe( browserSync.reload({stream:true}) );
		done();
	}
);


// SCRIPTS
// gulp.task('scripts', ()=>{
// 	return gulp.src([
// 			app+'/js/plugins/jquery.min.js',
// 			app+'/js/plugins/bootstrap.min.js',
// 			app+'/js/plugins/aos.js',
// 			app+'/js/plugins/owl.carousel.min.js',
// 			app+'/js/plugins/jquery.fancybox.js',
// 			app+'/js/plugins/jquery.mmenu.all.js',
// 			app+'/js/plugins/smooth-scroll.js',
// 			app+'/js/plugins/ion.rangeSlider.min.js',
// 			app+'/js/plugins/ResizeSensor.min.js',
// 			app+'/js/plugins/theia-sticky-sidebar.min.js',
// 			app+'/js/plugins/swiper-bundle.min.js',
// 			app+'/js/plugins/jquery.responsiveTabs.js',
// 			app+'/js/plugins/flickity.js',
// 		])
// 		.pipe( concat('scripts.min.js') )
// 		.pipe( uglify() )
// 		.pipe( gulp.dest('dist/js/') ); //js default
// 	}
// );

// STYLES
// gulp.task('cssnano', ()=>{
// 		return gulp.src(app+'/css/main.css')
// 		.pipe( cssnano({ reduceIdents :  false }) )
// 		.pipe(rename({suffix: '.min'}) )
// 		.pipe( gulp.dest(app+'/css/') ); //css default
// 	}
// );

// RELOADER BROWSER
gulp.task('browser-sync', (done)=>{
		browserSync({
			server: {baseDir: 'dist'},
			//proxy: "http://taf/",
			notify: false
		});
		done();
	}
);

	




gulp.task('watch', (done)=>{
		//gulp.task('default', gulp.series('watch', 'sass', 'browser-sync'));
		gulp.watch('app/scss/**/*.+(scss|sass)', gulp.parallel('sass'));
		gulp.watch('app/src/**/*.+(html|js|css)', gulp.parallel('fileinclude'));
		gulp.watch('app/js/**/*', gulp.parallel('js'));
		gulp.watch('app/img/**/*', gulp.parallel('img'));
		gulp.watch('app/fonts/**/*', gulp.parallel('fonts'));
		gulp.watch('app/files/**/*', gulp.parallel('files'));
		//gulp.watch(app+'/src/**/*', gulp.parallel('imgpaste'));
		//.on("change", function(){browserSync.reload(function(){console.log(111)})} );
		done();
	}
);



//gulp.task('default', gulp.series('watch', 'sass'));
//gulp.task('watch', gulp.series('watch','browser-sync', 'scripts', 'fileinclude'));
gulp.task('watch', gulp.series('watch', 'js', 'img', 'files', 'fonts', 'fileinclude', 'sass', 'browser-sync'));


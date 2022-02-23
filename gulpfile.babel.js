// Gulp babel 7+, Gulp 4.0.2+
import pkg  from './package.json'
import gulp from 'gulp'
import plugins from 'gulp-load-plugins'

const $ = plugins({
	pattern: ['*'],
	scope: ['devDependencies']
})

const server = $.browserSync.create()

const banner = [
	'/**',
	' * @project        <%= pkg.name %>',
	' * @author         <%= pkg.author %>',
	' * @build          ' + $.moment().format('llll'),
	' * @copyright      Copyright (c) ' + $.moment().format('YYYY') + ', <%= pkg.copyright %>',
	' *',
	' */',
	''
].join('\n')

const port = 1245
const basePath = {
	src     : './src/',
	build  : './build/'
}

const paths = {
    dist: {
        html  : basePath.build + '',
        images: basePath.build + '@asset/images/',
		videos: basePath.build + '@asset/videos/',
        font  : basePath.build + '@asset/fonts',
         css  : basePath.build + '@asset/css/',
          js  : basePath.build + '@asset/js/'
    },
    src: {
        html  : basePath.src + '',
        images: basePath.src + '@asset/images/**/*',
        videos: basePath.src + '@asset/videos/**/*',
        font  : basePath.src + '@asset/fonts/**/*.{eot,ttf,woff,woff2,svg}',
        scss  : basePath.src + '@asset/scss/**/*.scss',
         css  : basePath.src + '@asset/css/',
          js  : basePath.src + '@asset/js/'
    }
}

const clean = () => $.del([ basePath.build ], { force: true })

const onError = (err)=> { console.log(err) }

const serve = (cb)=> {
	$.connect.server({
		root: basePath.build,
		port: port,
		host: $.ip.address(),
		livereload: true
	});
	cb();
}


const imagemin = ()=> {
	return gulp.src(paths.src.images+'.{png,jpg,jpeg,gif,svg}')
		.pipe($.newer({dest: paths.dist.images}))
		.pipe($.print.default())
		// .pipe($.imagemin({
		//   progressive: true,
		//   interlaced: true,
		//   optimizationLevel: 7,
		//   svgoPlugins: [{removeViewBox: false}],
		//   verbose: true
		// }))
		.pipe(gulp.dest(paths.dist.images))
}

const html = ()=> {
	return gulp.src(paths.src.html+'**/!(_)*.html')
		.pipe($.fileInclude({
			prefix: '@@', 
			basepath: './src/@asset/inc/'
		}))
		.pipe($.prettyHtml())
		.pipe($.plumber({errorHandler: onError}))
		.pipe(gulp.dest(paths.dist.html))
		.pipe($.connect.reload())
}

const scss = ()=> {
	return gulp.src([ paths.src.scss ])
		.pipe($.plumber({errorHandler: onError}))
		.pipe($.sass({outputStyle: 'compact'}).on('error', $.sass.logError))
		.pipe($.autoprefixer({cascade: false }))
		.pipe($.groupCssMediaQueries())
		.pipe($.cleanCss({
			format: 'keep-breaks',
			rebase : false,
			level: {
				1: {removeQuotes: false},
				2: {mergeAdjacentRule: true}
			}
		}))
		.pipe($.cached('sass_compile'))
		.pipe($.size({gzip: true, showFiles: true}))
		// .pipe($.rename(function(path) {
		// 	console.log( path );
		// 	path.dirname = path.dirname.replace('scss', 'css');
		// }))
		// .pipe(gulp.dest(paths.src.css))
		.pipe(gulp.dest(paths.dist.css))
}

const css = function () {
	return gulp.src([paths.src.css+'**/*.css'])
		.pipe($.plumber({errorHandler: onError}))
		.pipe($.newer({dest: paths.dist.css+'**/*.css'}))
		.pipe($.print.default())
		// .pipe($.sourcemaps.init({loadMaps: true}))
		// .pipe($.concat('style.css')) //스타일 합치기 안함.
		.pipe($.cssnano({
			autoprefixer: false,        // autoprefixer 제거
			cssDeclarationSorter: true, // 속성값 정렬
			discardComments: {          // 주석제거
				removeAll: true // or [removeAll]
			},
			discardDuplicates: true,    // 중복값 제거
			discardEmpty: true,         // 빈값 제거
			mergeRules: true,
			minifyFontValues: false,    // 글꼴 선언을 표준화
			discardUnused: false,       // css관련없는 룰 삭제. 웹폰트 제거되서 false.
			minifySelectors: true,
			reduceTransforms: false
		}))
		.pipe($.header(banner, {pkg: pkg}))
		// .pipe($.sourcemaps.write('./'))
		.pipe($.size({gzip: true, showFiles: true}))
	    .pipe($.if(['*.js', '!*.min.js'], $.rename({suffix: '.min'})))
		.pipe(gulp.dest(paths.dist.css))
		.pipe($.connect.reload())
}

export const scripts = () => {
	return gulp.src(paths.src.js+'**/*.js')
		.pipe(gulp.dest(paths.dist.js))
	}
export const videos = () => {
	return gulp.src(paths.src.videos)
		.pipe(gulp.dest(paths.dist.videos))
	}

export const fonts = () => {
	return gulp.src(paths.src.font)
		.pipe($.newer({dest: paths.dist.font}))
		.pipe(gulp.dest(paths.dist.font))
}


const watchFiles = (cb) => {
	gulp.watch(paths.src.scss, styles)
    gulp.watch(paths.src.images, imagemin)
    gulp.watch(paths.src.js+'**/*.js', scripts)
    gulp.watch(paths.src.videos, videos)
    gulp.watch(paths.src.html+'**/*.html', html, () => {
		$.connect.reload()
    })

	// const watcher = gulp.watch([ paths.src.images ]);
	
	// watcher.on('unlink', function(file) {
	// 	const deletePath = file.replace('Q2B2', '../global/galaxy');
	// 	$.fancyLog( 'Remove File: ', deletePath );
	// 	$.del( [ deletePath ], {force: true } );
	// });

}

const styles = gulp.series(scss)

const dev = gulp.series(clean, gulp.parallel( imagemin, styles, videos, fonts,scripts ), html, serve)
const defaults = gulp.series(dev, gulp.parallel(watchFiles))
const build = gulp.parallel(imagemin, styles, html)

export { dev, clean, html, imagemin, scss, styles, watchFiles as watch, build }
export default defaults;

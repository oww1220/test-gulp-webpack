const URL = 'pc';

const gulp = require('gulp');
const del = require('del');

/*유틸*/
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');

/*view server*/
const browserSync = require('browser-sync').create();

/*scss, css*/
const sass = require('gulp-sass');
sass.compiler = require('node-sass');
const autoprefixer = require('gulp-autoprefixer');
const modifyCssUrls = require('gulp-modify-css-urls');
const pxtorem = require('gulp-pxtorem');
const cssnano = require('gulp-cssnano');


/*오류 처리*/
const plumber = require('gulp-plumber');

/*타입스크립트*/
const ts = require('gulp-typescript');

/*webpack*/
const webpack = require('webpack-stream');


const errorHandler = (error)=>{
    console.error(error.message);
    this.emit('end');
};
const plumberOption = {
    errorHandler: errorHandler,
};



const autoprefixBrowsers = ['> 0%', 'last 4 versions'];
const BASE_URL = `./wwwroot/${URL}`;
const TASK_BASE_URL = `${BASE_URL}/assets`;


// typescript: typescript 컴파일러
gulp.task('ts', ()=> {
    const tsProject = ts.createProject('tsconfig.json');
return gulp
    .src(`${TASK_BASE_URL}/ts/**/*.ts`
        , {allowEmpty: true}
    )
    .pipe(tsProject())
    .pipe(gulp.dest(`${TASK_BASE_URL}/scripts/build`))
});


// webpack: 타입스크립트 컴파일 && 바밸 트렌스파일링
gulp.task('webpack', ()=>
    gulp
    .src(`${TASK_BASE_URL}/scripts/build/**/*.js`, {allowEmpty: true})
    .pipe(plumber(plumberOption))
    .pipe(webpack({
        mode: 'production',
        // 파일 다중으로 내보내기 가능
        /*
        entry: {
            //CommonUI: [`${TASK_BASE_URL}/scripts/build/dist/CommonUI.js`, `${TASK_BASE_URL}/scripts/build/dist/browser.js`],
            //UI: `${TASK_BASE_URL}/scripts/build/dist/UI/Datepicker.js`,
        },
        output: {filename: '[name].bundle.js'},
        */
        output: {
            filename: 'UI.bundle.js',
            chunkFilename: '[name].chunk.js',
        },
        resolve: {
            extensions: ['.js']
        },
        devtool: 'source-map',
        module: {   
            rules: [
                {
                    test: /\.(js)$/,
                    exclude: /node_modules\/(?!bullets-js)/,
                    use: ['babel-loader'],
                }
            ]
        },
        //plugins: [new ForkTsCheckerWebpackPlugin()]
    }))
    .pipe(gulp.dest(`${TASK_BASE_URL}/scripts/bundle`))
    .pipe(browserSync.reload({ stream: true }))
);


// sass: sass컴파일러, px-->rem, autoprefixer 
gulp.task('sass', ()=>
    gulp
    .src(`${TASK_BASE_URL}/scss/**/*.scss`)
    .pipe(plumber(plumberOption))
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(
        sass({
            outputStyle: 'compressed', //[nested, compact, expanded, compressed]
            //indentType: 'tab',
            //indentWidth: 1,
        }).on('error', sass.logError)
    )
    .pipe(cssnano())
    .pipe(pxtorem({
            propList: ['*', '!'], // (Array) Use wildcard * to enable all properties. Use ! to not match a property. 
            rootValue: 16, // (Number | Function) Represents the root element font size
            replace: false, //  (Boolean) Replaces rules containing rems instead of adding fallbacks.
            minPixelValue: 2, // (Number) Set the minimum pixel value to replace.
            mediaQuery: false // (Boolean) Allow px to be converted in media queries.
        }
    ))
    .pipe(
        autoprefixer({
            browsers: autoprefixBrowsers,
            cascade: true,
        })
	)
    //.pipe(concat('UI.bundle.css'))
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest(`${TASK_BASE_URL}/styles`))
    .pipe(browserSync.reload({ stream: true }))
);


// clean: 파일정리(delete)
gulp.task('clean', ()=>
    del([`${TASK_BASE_URL}/scripts/build`], {force:true})
);

// watch: 소스 옵져빙(소스변경 감지해서 task실행및 서버 재시작)
gulp.task('watch', ()=> {

    //서버실행
    browserSync.init({
        //logLevel: 'debug',
        port: 3330,
        open: false,
        directory: true,
        server: './wwwroot/',
        browser: 'google chrome',
    });

    // watch sass
    gulp.watch(
        `${TASK_BASE_URL}/scss/**/*.scss`,
        gulp.series('sass')
    );

    // watch ts
    gulp.watch(
        `${BASE_URL}/**/*.ts`,
        gulp.series('ts', 'webpack', 'clean')
    );

    // watch html
    gulp.watch(`${BASE_URL}/**/*.html`).on('change', browserSync.reload);
});

// task 묶어서 실행
gulp.task(
    'default',
    gulp.series('sass', 'ts', 'webpack', 'clean', 'watch')
);

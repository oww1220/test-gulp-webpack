const URL = 'pc';

const gulp = require('gulp');
const del = require('del');

/*유틸*/
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');

/*view server*/
const browserSync = require('browser-sync').create();


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

// concat: 제이쿼리 코어및 사용 플러그인들 머지 -- 선택
gulp.task('jquery:concat', ()=>
    gulp
    .src(`${TASK_BASE_URL}/scripts/jquery/**/*.js`)
    .pipe(plumber(plumberOption))
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(concat('jquery.bundle.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(`${TASK_BASE_URL}/scripts/bundle`))
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
        port: 3333,
        open: false,
        directory: true,
        server: './wwwroot/',
        browser: 'google chrome',
    });

    // watch ts
    gulp.watch(
        `${BASE_URL}/**/*.ts`,
        gulp.series('ts', 'webpack')
    );

    // watch html
    gulp.watch(`${BASE_URL}/**/*.html`).on('change', browserSync.reload);
});

// task 묶어서 실행
gulp.task(
    'default',
    gulp.series('ts', 'webpack', 'watch')
);

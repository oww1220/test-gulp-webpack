import $ from 'jquery';
import CommonUI from '@src/CommonUI';
import * as Const from '@src/Lib/Const';

const log = console.log;

// ---- test code ---- //
$(() => {
    //ie test es6 method!

    const { Async, Fn } = CommonUI;

    log('TOUCH_EVENT', Const.TOUCH_EVENT);

    const aaa = new Promise<number>((resolve, reject) => {
        setTimeout(() => {
            resolve(1);
        }, 2000);
    }).then((result) => {
        //log(result + 1); // 1
        return result;
    });

    const bb = {
        as: 1,
        cs: 3,
    };

    const { as, cs } = bb;

    const ddd = Object.assign({ as }, { cs });
    log(ddd);
    log(ddd);
    //log(ddd);

    //비동기 함수들 --> 동기적으로 실행 예시!!
    const promiseCallback: PromiseCallback = (resolve, reject) => {
        $('.col:first-child h2').animate({ 'margin-left': 100 }, 5000, () => {
            resolve(true);
            //reject(new Error('에러다!'));
        });
    };
    const promiseCallback2: PromiseCallback = (resolve, reject) => {
        $('.col:first-child h2').animate({ 'margin-left': 0 }, 5000, () => {
            resolve(true);
            //reject(new Error('에러다!'));
        });
    };
    Async.generaterRun(function* () {
        //log('!!!!!!!!!!!!start');
        try {
            const delay1 = yield Async.wait(2000, 'delay2초');
            //log(delay1);

            const runVal11 = yield Async.promise(promiseCallback);
            //log(runVal11);

            const runVal2 = yield 'test2';
            //log(runVal2);

            const delay2 = yield Async.wait(3000, 'delay3초');
            //log(delay2);

            const runVal22 = yield Async.promise(promiseCallback2);
        } catch (err) {
            log(err.message);
        }
        //log(runVal22);

        //log('end!!!!!!!!!!!!');
    });

    //(Array.prototype as any).mapToNumbers = function () {
    ///* ... */
    //};

    //함수형 프로그래밍 test코드!
    const FF = (list: number[], length: number) => {
        return Fn.reduce(
            (acc, a) => acc + a,
            0,
            Fn.take(
                length,
                Fn.map(
                    (a) => a * a,
                    Fn.filter((a) => Boolean(a % 2), list),
                ),
            )!,
        );
    };

    //const test11 = Fn.filter((a)=>Boolean(a%2), [1,2,3,4,5]);
    //log('리턴값', test11);

    (() => {
        log(FF([1, 2, 3, 4, 5], 2));
    })();
});

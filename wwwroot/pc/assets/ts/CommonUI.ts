import '@babel/polyfill';
import { IJqMap, Iiscrolls, SwiperParam, slideSortParam } from 'CommonUI';
import jQuery from 'jquery';
import 'jqueryui';
import 'slick-carousel';
import IScroll from 'iscroll';
import Swiper from 'swiper';

namespace CommonUI {
    export const $: JQueryStatic = jQuery;
    export const Resize = {
        chk(target: JQuery) {
            if ((target.width() || 0) >= 1025) {
                target.removeClass('pc mobile tablet').addClass('pc');
            } else if ((target.width() || 0) >= 768) {
                target.removeClass('pc mobile tablet').addClass('tablet');
            } else {
                target.removeClass('pc mobile tablet').addClass('mobile');
            }
        },
        font() {
            const doc = document.documentElement;
            const caculateWidth = String((doc.clientWidth / 320) * 62.5 * 100);
            let fontSizeVal = parseFloat(caculateWidth) / 100;
            fontSizeVal = fontSizeVal >= 85 ? 85 : fontSizeVal;

            doc.style.fontSize = fontSizeVal + '%';
        },
        resize($BODY: JQuery) {
            $(window).on('resize', () => {
                this.chk($BODY);
                this.font();
            });
        },
    };
    export const Map = {
        init() {
            class JqMap implements IJqMap {
                map: IObj | null = null;
                constructor() {
                    this.map = new Object();
                }
                /* key, value 값으로 구성된 데이터를 추가 */
                put<T>(key: string | number, value: T) {
                    this.map![key] = value;
                }
                /* 지정한 key값의 value값 반환 */
                get<T>(key: string | number): T {
                    return this.map![key];
                }
                /* 구성된 key 값 존재여부 반환 */
                containsKey(key: string | number): boolean {
                    return key in this.map!;
                }
                /* 구성된 데이터 초기화 */
                clear() {
                    for (const prop in this.map) {
                        delete this.map[prop];
                    }
                }
                /*  key에 해당하는 데이터 삭제 */
                remove(key: string | number) {
                    delete this.map![key];
                }
                /* 배열로 key 반환 */
                keys(): (string | number)[] {
                    const arKey: (string | number)[] = new Array();
                    for (const prop in this.map) {
                        arKey.push(prop);
                    }
                    return arKey;
                }
                /* 배열로 value 반환 */
                values(): any[] {
                    const arVal = new Array();
                    for (const prop in this.map) {
                        arVal.push(this.map[prop]);
                    }
                    return arVal;
                }
                /* Map에 구성된 개수 반환 */
                size(): number {
                    let count = 0;
                    for (const prop in this.map) {
                        count++;
                    }
                    return count;
                }
            }

            return new JqMap();
        },
    };
    export const Slide = {
        init(target: SwiperParam, sort: slideSortParam, option?: IObj) {
            if (sort == 'slick' && typeof target === 'string') {
                const $target = $(target);
                return $target.slick(option!);
            }
            if (sort === 'swiper') {
                return new Swiper(target, option!);
            }
        },
    };
    export const Layer = {
        scrollTop: 0,
        calculate(layer: string) {
            const $layer = $(layer),
                layerIn = $layer.find('.pop_inner'),
                winH = $(window).height() || 0,
                winW = $(window).width() || 0;

            layerIn.find('.pop_scroll').removeAttr('style');

            const layerH = $layer.height() || 0,
                layerW = $layer.width() || 0,
                marginH = parseInt(layerIn.css('marginTop')) + parseInt(layerIn.css('marginBottom'));
            //console.log(layer, winH, winW, layerH, layerW, marginH);

            if (winH < layerH) {
                layerIn.find('.pop_scroll').css({
                    height: winH - marginH,
                    overflow: 'auto',
                });
                $layer.css({
                    top: 0,
                    left: (winW - layerW) / 2,
                });
            } else {
                layerIn.find('.pop_scroll').removeAttr('style');
                $layer.css({
                    top: (winH - layerH) / 2,
                    left: (winW - layerW) / 2,
                });
            }
        },
        openClick(
            target: string,
            dimmed: string,
            parent: string,
            callback?: (show: () => void, layer: string, targetDom: JQuery) => void,
        ) {
            const that = this;
            $(document).on('click', target, function (e) {
                const layer = '.' + $(this).data('layer');
                const targetDom = $(this);
                //that.scrollTop = $(window).scrollTop();

                const show = () => {
                    that.open(layer, dimmed, parent);
                };

                if (callback) {
                    callback(show, layer, targetDom);
                } else {
                    show();
                }

                e.preventDefault();
            });
        },
        open(layer: string, dimmed: string, parent: string, callback?: (layer: string) => void) {
            const that = this;
            that.scrollTop = $(window).scrollTop() || 0;
            $('body').addClass('fixed');
            $('body').css({ top: -that.scrollTop });
            if (dimmed) $(dimmed).fadeIn();
            if (callback) callback(layer);
            $(parent + layer).show();
            that.calculate(layer);
            $(window).on('resize.layer', function () {
                that.calculate(layer);
            });
        },
        closeClick(
            target: string,
            dimmed: string,
            parent: string,
            callback?: (hide: () => void, layer: string, targetDom: JQuery) => void,
        ) {
            const that = this;
            $(document).on('click', target, function (e) {
                let layer: string;
                const targetDom = $(this);
                const hide = () => {
                    that.close(layer, dimmed, parent);
                };
                if (target == dimmed) {
                    layer = parent;
                } else {
                    layer = parent + '.' + $(this).data('layer');
                }

                if (callback) {
                    callback(hide, layer, targetDom);
                } else {
                    hide();
                }

                e.preventDefault();
            });
        },
        close(layer: string, dimmed: string, parent: string, callback?: (layer: string) => void) {
            const that = this;
            if (layer != dimmed) {
                $(layer).hide();
            } else {
                $(parent).hide();
            }
            if (dimmed) $(dimmed).fadeOut();
            if (callback) callback(layer);
            $('body').removeClass('fixed');
            $('body').css({ top: 0 });
            $(window).scrollTop(that.scrollTop);
            $(window).off('resize.layer');
        },
    };
    export const Event = {
        toggle(target: string, parent: string | null, callback?: (logic: () => void, layer: JQuery) => void) {
            $(document).on('click', target, function (e) {
                const $this = $(this);
                const $targetDiv = $(target);
                const layer = $('.' + $this.data('target'));
                const sort = $this.data('sort');
                const onClass = $this.data('on');
                const siblings = $this.data('siblings');
                const $parent = $(parent!);
                //console.log(sort, onClass, siblings, $parent);

                const logic = () => {
                    if (onClass) {
                        if (parent === null ? $this.hasClass('on') : layer.is(':visible')) {
                            $this.removeClass('on');
                            layer.removeClass('on');
                        } else {
                            if (siblings) {
                                $targetDiv.removeClass('on');
                                $parent.removeClass('on');
                            }
                            $this.addClass('on');
                            layer.addClass('on');
                        }
                    }

                    if (layer.is(':visible')) {
                        if (sort == 'fade') {
                            layer.fadeOut();
                        } else if (sort == 'normal') {
                            layer.hide();
                        } else if (sort == 'none') {
                            return false;
                        } else {
                            layer.slideUp();
                        }
                    } else {
                        if (sort == 'fade') {
                            if (siblings) {
                                $parent.fadeOut();
                            }
                            layer.fadeIn();
                        } else if (sort == 'normal') {
                            if (siblings) {
                                $parent.hide();
                            }
                            layer.show();
                        } else if (sort == 'none') {
                            return false;
                        } else {
                            if (siblings) {
                                $parent.slideUp();
                            }
                            layer.slideDown();
                        }
                    }
                };

                if (callback) {
                    callback(logic, layer);
                } else {
                    logic();
                }
                //e.preventDefault();
            });
        },
        goTop(target: JQuery) {
            target.on('click', function (e) {
                $('html, body').stop().animate({ scrollTop: 0 }, 1000);
                e.preventDefault();
            });
        },
        topScrollCh(target: JQuery, parent: JQuery) {
            if (parent.hasClass('pc')) {
                const winScroll = $(window).scrollTop() || 0;
                if (winScroll == 0) {
                    target.fadeOut();
                    $('#header .inner').removeClass('on');
                } else {
                    target.fadeIn();
                    $('#header .inner').addClass('on');
                }
            } else {
                return;
            }
        },
        taps(tab_nav: string, callback?: (swap: () => void) => void) {
            const target = tab_nav + '.tab_nav li';
            //console.log(target);
            $(document).on('click', target, function (e) {
                const $this = $(this);
                const $layer = $(tab_nav + '.tab_cont');
                const idx = $this.index();

                const swap = () => {
                    $this.addClass('on').siblings().removeClass('on');
                    $layer.find('> div').eq(idx).show().siblings().hide();
                };
                if (callback) {
                    callback(swap);
                } else {
                    swap();
                }
                e.preventDefault();
            });
        },
        calander(
            target: string,
            option: IObj,
            callback?: JQuery.TypeEventHandler<HTMLElement, unknown, any, any, 'change'>,
        ) {
            $(target).each(function () {
                $(this).datepicker(option);
                $(this).datepicker('setDate', 'today');
                if (callback) $(this).on('change', callback);
            });
        },
        customSelect(parent: string) {
            const target = parent + ' button';
            const listTarget = parent + ' a';
            let $parent: JQuery;
            $(document).on('click', target, function (e) {
                $parent = $(this).parent();
                if ($parent.hasClass('on')) {
                    $parent.removeClass('on');
                } else {
                    $(parent).removeClass('on');
                    $parent.addClass('on');
                    CommonUI.Iscrolls.resize();
                }
                //console.log($parent);
            });
            $(document).on('click', listTarget, function (e) {
                const bt = $parent.find('button');
                const input = $parent.find('input');
                const val = $(this).data('val');
                const text = $(this).text();

                input.val(val);
                bt.text(text);
                //console.log(input, input.val());

                $parent.addClass('select');
                $parent.removeClass('on');

                e.preventDefault();
            });
        },
        changeSelect(target: string) {
            $(document).on('change', target, function (e) {
                const val = $(this).val();
                const target = $(this).parent().find('.selText');
                if (val == 'DISP_ROOT') {
                    target.html(target.attr('data-name') || '');
                } else {
                    target.html(
                        $(this)
                            .find('.bestSubCate' + val)
                            .attr('data-name') || '',
                    );
                }
            });
        },
        fixedTop() {
            let enScrollTop = 0,
                beScrollTop = 0;
            const $header = $('#header'),
                $topBanner = $('.top_bn_w'),
                fixdTop = $header.offset()!.top || 0,
                paddingTop = $header.height() || 0,
                scrollThreshold = 90;

            if ($topBanner.length && $topBanner.is(':visible')) {
                $header.removeClass('fixed');
                $header.css({ height: 'auto' });
            } else {
                $header.addClass('fixed');
                $header.css({ height: paddingTop });
            }

            $(window).on('scroll', function (e) {
                const scrollpos = window.scrollY || window.pageYOffset;

                enScrollTop = scrollpos;

                if ($topBanner.length && $topBanner.is(':visible')) {
                    //console.log(fixdTop, scrollpos);
                    if (fixdTop <= scrollpos) {
                        $header.addClass('fixed');
                    } else {
                        $header.removeClass('fixed');
                    }
                }
                if (Math.abs(enScrollTop - beScrollTop) < scrollThreshold) return false;

                if (!$('body').hasClass('pc')) {
                    beScrollTop > enScrollTop ? $header.removeClass('on') : $header.addClass('on');
                } else {
                    $header.removeClass('on');
                }
                beScrollTop = enScrollTop;
            });
        },
    };
    export const Iscrolls: Iiscrolls = {
        cash: null,
        num: 0,
        init(target, option) {
            this.cash = this.cash ? this.cash : CommonUI.Map.init();
            $(target).each((idx: number, item) => {
                const targetIdx = $(target)[idx];
                //console.log(IScroll);
                targetIdx.iscrolls = new IScroll(item, option);
                //console.log(item);
                this.cash!.put(this.num++, { sort: item, option: option });
            });
            //console.log(this.cash);
        },
        resize: function () {
            if (!this.cash) return;
            $.each(this.cash.map, (key: number, value: { sort: HTMLElement; option: IObj }) => {
                if (value.sort.className == 'select_list') {
                    //console.log(key, value.sort.iscrolls);
                    value.sort.iscrolls!.scrollTo(0, 0);
                }
            });
        },
    };
    export const Async = {
        generaterRun(gen: () => Generator) {
            const iter = gen();
            (function iterate({ value, done }) {
                if (done) return value;
                if (value.constructor === Promise) {
                    /*
                        프라미스 객체가 이행(Fulfilled)상태면 -> then 핸들러 샐행 : resolve 된 값을 받아 멈춰진 yield 표현식 변수에 값을 넣어주고 다음 yield까지 코드 실행(재귀호출로)! 
                        프라미스 객체가 실패(Rejected) 상태면 -> catch 핸들러 샐행 : Generator.throw 메소드를 실행하여 제너레이터에 에러를 알려줌!
                    */
                    value.then((data) => iterate(iter.next(data))).catch((err) => iter.throw(err));
                } else {
                    iterate(iter.next(value));
                }
            })(iter.next());
        },
        wait(ms: number, value?: any) {
            return new Promise((resolve) => setTimeout(resolve, ms, value));
        },
        promise(callback: PromiseCallback) {
            return new Promise((resolve, reject) => {
                /*
                리턴되어진 프라미스(future 모나드 타입) 핸들러(1. 값을 꺼내어 연산이나 평가후 다시 future 모나드 타입으로만들어서 return 하거나, 2.프로시저로 작성해서 흐름을 마무리): then 핸들러, catch 핸들러
                new Promise에 전달되는 파라미터 함수는 executor(실행자, 실행 함수) 라고 부릅니다. 
                    resolve 함수 실행시 : 리턴되어진 프라미스(future 모나드 타입) 객체가 이행(Fulfilled) 상태가 됩니다.
                    reject 함수 실행시 : 리턴되어진 프라미스(future 모나드 타입) 객체가 실패(Rejected) 상태가 됩니다.
                */

                // 기본적으로 에러는 발생함..... catch유무확인...내용임!!
                // 프라미스 executor(실행자, 실행 함수)와 프라미스 핸들러 코드 주위엔 '보이지 않는 try..catch'가 있습니다. 예외가 발생하면 암시적 try..catch에서 예외를 잡고, 이를 reject처럼 다룹니다.
                // throw new Error("에러 발생!");
                // reject(new Error("에러 발생!"));
                // -- 위 두 케이스는 모두 error catch 할수있음!
                /*
                // setTimeout 메소드는 비동기로 에러가 나중에 발생하기때문에 reject로 비동기 함수 실행시점에 에러를 알려주어야된다(error catch됨)!
                setTimeout(() => {
                    //throw new Error("에러 발생!");
                    //reject(new Error("에러 발생!"));
                }, 1000);

                ** 비동기식으로 작동하는 콜백의 내부에서 발생한 에러는, 콜백 바깥에 있는 try 블록으로는 잡아낼 수 없습니다.
                ** JavaScript 엔진은 에러가 발생하는 순간 호출 스택을 되감는 과정을 거칩니다. 
                이 과정 중에 try 블록을 만나야 코드의 실행 흐름을 원상복구시킬 수 있습니다. 
                위 예제에서 setTimeout에 넘겨진 콜백에서 throw new Error("에러 발생!")가 발생하면, 
                호출 스택을 따라 올라가도 try 블록을 만나는 것이 아니므로, (setTimeout는 task queue에 저장 )
                (Event Loop는 사전적인 의미처럼 계속 반복해서 call stack과 queue 사이의 작업들을 확인하고, call stack이 비워있는 경우 queue에서 작업을 꺼내어 call stack에 넣는다.)
                코드의 실행 흐름이 catch 블록으로 옮겨지지 않는 것입니다. (즉setTimeout 비동기 함수가 실행되는 시점은 call stack 이 비워져 있는 시점이라  try 블록을 만날수가 없다!!!!!)
                
                즉, throw new Error("에러 발생!")에러는 executor(실행자, 실행 함수)가 실행되는 동안만  유효함(error catch됨)!!!!!!
                */

                // 하단 콜백은 에러가 다른문맥에서 발생하기때문에 reject로 해당함수 문맥에서 에러를 알려주어야된다(error catch됨)!
                callback(resolve, reject);
            });
        },
    };

    //함수형 프로그래밍 공부용 모듈!
    export const Fn = {
        filter: function* <T>(f: (a: T) => boolean, iter: Iterable<T>) {
            for (const a of iter) {
                if (f(a)) yield a;
            }
        },
        map: function* <T>(f: (a: T) => T, iter: Iterable<T>) {
            for (const a of iter) {
                yield f(a);
            }
        },
        take: function <T>(length: number, iter: Iterable<T>) {
            let res: T[] = [];
            for (const a of iter) {
                res.push(a);
                if (res.length === length) return res;
            }
            return res;
        },
        reduce: function <T, U>(f: (acc: U, a: T) => U, acc: U, iter: Iterable<T>) {
            for (const a of iter) {
                acc = f(acc, a);
            }
            return acc;
        },
    };
}
export default CommonUI;

//전역으로 내보냄 -- 선택사항
window.CommonUI = CommonUI;

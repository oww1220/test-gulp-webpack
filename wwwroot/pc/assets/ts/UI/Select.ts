import $ from 'jquery';
import CommonUI from '@src/CommonUI';

// ---- Select ---- //
$(() => {
    const { Event, Iscrolls } = CommonUI;

    //커스텀 셀렉트
    Event.customSelect('.select_custum');
    $(window).on('load', function () {
        /*아이스크롤*/
        if ($('.select_custum .select_list').length) {
            Iscrolls.init('.select_custum .select_list', {
                scrollbars: true,
                mouseWheel: true,
                interactiveScrollbars: true,
                shrinkScrollbars: 'scale',
                fadeScrollbars: true,
                hScroll: false,
            });
        }
    });

    //커스텀 셀렉트(기본 인풋사용)
    Event.changeSelect('.sort_select select');
});

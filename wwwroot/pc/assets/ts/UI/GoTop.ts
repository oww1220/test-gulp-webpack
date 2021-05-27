import $ from 'jquery';
import CommonUI from '@src/CommonUI';

// ---- GoTop ---- //
$(() => {
    const { Event } = CommonUI;

    const $BODY = $('body'),
        $GOTOP = $('.btnTop');

    /*top으로*/
    Event.goTop($GOTOP);

    /*pc top으로 scroll*/
    Event.topScrollCh($GOTOP, $BODY);
    $(window).on('scroll', function () {
        Event.topScrollCh($GOTOP, $BODY);
    });
});

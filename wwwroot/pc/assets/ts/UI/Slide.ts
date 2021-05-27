import $ from 'jquery';
import CommonUI from '@src/CommonUI';

// ---- Slide ---- //
$(() => {
    const { Slide } = CommonUI;

    if ($('.target1').length && $.fn.slick) {
        Slide.init('.target1', 'slick', {
            infinite: true,
            autoplay: true,
            arrows: true,
            dots: true,
        });
        $('.target1').on('mouseleave', function (e) {
            $(this).slick('slickPlay');
        });
    }

    Slide.init('.swiper-container', 'swiper');
});

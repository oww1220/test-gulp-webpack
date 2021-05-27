import $ from 'jquery';
import CommonUI from '@src/CommonUI';

// ---- Datepicker ---- //
$(() => {
    const { Event } = CommonUI;
    Event.calander(
        '.datepicker',
        {
            dateFormat: 'yy-mm-dd',
            showMonthAfterYear: true,
            changeYear: false,
            changeMonth: false,
            showOn: 'both',
            buttonText: '날짜선택',
            yearSuffix: '.',
            monthNames: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
            monthNamesShort: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
            dayNames: ['일', '월', '화', '수', '목', '금', '토'],
            dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
            dayNamesMin: ['일', '월', '화', '수', '목', '금', '토'],
        },
        function (e) {
            console.log('날짜변경됨');
        },
    );

    /*
    CommonUI.event.calander('.datepicker', {
        changeMonth:true,
        changeYear:true,
        showOn:'button',
        buttonText: '선택',
        buttonImageOnly:false,
        showMonthAfterYear:true,
        minDate:null,  //최소 기간
        maxDate:null,  //최대 노출
        yearRange:'c-5:c+5',  //노출되는 범위
        dateFormat :'yy-mm-dd',
        dayNamesMin:['일', '월', '화', '수', '목', '금', '토'],
        monthNamesShort: [ '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12' ],
    },
    function(e){
        console.log('날짜변경됨');
    });*/
});

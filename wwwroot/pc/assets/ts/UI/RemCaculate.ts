import $ from 'jquery';
import CommonUI from '@src/CommonUI';

// ---- RemCaculate ---- //
//rem 설정 및 호스트 환경체크
const { Resize } = CommonUI;

Resize.font();

$(() => {
    const $BODY = $('body');

    /*호스트환경 체크*/
    Resize.chk($BODY);
    Resize.resize($BODY);
});

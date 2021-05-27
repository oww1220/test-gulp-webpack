import $ from 'jquery';
import CommonUI from '@src/CommonUI';
import * as Const from '@src/Lib/Const';

// ---- LayerPop ---- //
$(() => {
    const { Layer } = CommonUI;

    /*오픈 이벤트------*/
    //1
    $(document).on('click', '#layer_open1', function () {
        Layer.open('.layer-common', Const.LAYER_DIM, Const.LAYER_PARENT, () => {
            console.log('open');
        });
    });
    //2
    Layer.openClick('#layer_open2', Const.LAYER_DIM, Const.LAYER_PARENT, (show) => {
        console.log('open');
        show();
    });

    /*닫기 이벤트------*/
    //1
    $(document).on('click', '#layer_close1', function () {
        Layer.close('.layer-common', Const.LAYER_DIM, Const.LAYER_PARENT, () => {
            console.log('close');
        });
    });

    //2
    Layer.closeClick('#layer_close2', Const.LAYER_DIM, Const.LAYER_PARENT, (hide) => {
        console.log('close');
        hide();
    });

    /*배경닫기 이벤트------*/
    $(Const.LAYER_DIM).on('click', function (e) {
        Layer.close(Const.LAYER_DIM, Const.LAYER_DIM, Const.LAYER_PARENT, () => {
            console.log('close');
        });
    });
});

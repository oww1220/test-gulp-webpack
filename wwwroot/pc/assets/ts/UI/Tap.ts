import $ from 'jquery';
import CommonUI from '@src/CommonUI';

// ---- Tap ---- //
$(() => {
    const { Event } = CommonUI;

    Event.taps('.tab-normal', (swap) => {
        console.log('taps');
        swap();
    });
    Event.taps('.tab-normal2', (swap) => {
        console.log('taps');
        swap();
    });
});

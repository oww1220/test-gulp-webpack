declare module 'Type_CommonUI' {
    interface Iiscrolls {
        cash: IJqMap | null;
        num: number;
        init(target: string, option: IObj): void;
        resize(): void;
    }
    interface IJqMap {
        map: IObj | null;
        put<T>(key:string | number, value: T): void;
        get<T>(key:string | number): T;
        containsKey(key:string | number): boolean;
        clear(): void;
        remove(key:string | number): void;
        keys(): (string | number)[];
        values(): any[];
        size(): number;
    }

    /*type*/
    type SwiperParam = string | HTMLElement;
    type slideSortParam = 'slick' | 'swiper';
    
}

declare module 'CommonUI' {
    interface IJqMap {
        map: IObj | null;
        put<T>(key:string | number, value: T): void;
        get<T>(key:string | number): T;
        containsKey(key:string | number): boolean;
        clear(): void;
        remove(key:string | number): void;
        keys(): (string | number)[];
        values(): any[];
        size(): number;
    }
    /*type*/
    type SwiperParam = string | HTMLElement;
    type slideSortParam = 'slick' | 'swiper';
    
    interface IEvent {
        toggle(target: string, parent: string | null, callback?: (logic: () => void, layer: JQuery) => void): void;
        goTop(target: JQuery): void;
        topScrollCh(target: JQuery, parent: JQuery): void;
        taps(tab_nav: string, callback?: (swap: () => void) => void): void;
        calander(
            target: string,
            option: IObj,
            callback?: JQuery.TypeEventHandler<HTMLElement, unknown, any, any, 'change'>,
        ): void;
        customSelect(parent: string): void;
        changeSelect(target: string): void;
        fixedTop(): void;
    }
    interface Iiscrolls {
        cash: IJqMap | null;
        num: number;
        init(target: string, option: IObj): void;
        resize(): void;
    }
    namespace CommonUI {
        const $: any;
        const Resize: any;
        const Map: any;
        const Slide: any;
        const Layer: any;
        const Event: IEvent;
        const Iscrolls: Iiscrolls;
        const Async: any;
        const Fn: any;
    }

    export default CommonUI;
}

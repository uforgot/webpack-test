export default class df {
    constructor() {
        window.addEventListener('resize', (e)=>{this.resize(e)});
        window.addEventListener('onscroll', (e)=>{this.scroll(e)});
    }

    scroll() {
        console.log('scroll');
    }

    resize(e) {
        console.log('resize');
        this.resizeHandler(e);
    }

    resizeHandler(e) {
        console.log(e);
    }

}
import df from './df';

class Index extends df {
    constructor() {
        super();
    }

    resizeHandler(e) {
        super.resizeHandler(e);
        console.log(e);
    }
}

new Index();
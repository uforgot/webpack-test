export default class Slider {
    constructor(el) {
        this.el = el;
        this.margin = 100;

        this.id = 0;
        this.max = this.el.find('img').length;

        this.x = 0;
        this.addEvent();
    }

    addEvent() {
        this.resizeHandler();

        window.addEventListener('resize', (e)=>{this.resizeHandler(e);})
        this.el.on('mousedown', (e)=>{this.mouseDownHandler(e);})
        this.el.on('mousemove', (e)=>{this.mouseMoveHandler(e);})
        this.el.on('mouseup', (e)=>{this.mouseUpHandler(e);})
        this.el.on('mouseleave', (e)=>{this.mouseLeaveHandler(e);})

        this.el.find('.prev').on('click', (e)=>{this.setPrev();});
        this.el.find('.next').on('click', (e)=>{this.setNext();});
    }

    resizeHandler(e) {
        this.winWidth = window.innerWidth;
        this.sliderWidth = this.winWidth - (this.margin*2);

        this.el.width(this.sliderWidth);
        this.el.css('margin-left', this.margin);

        this.el.find('img').width(this.sliderWidth);
        this.el.find('ul').width(this.sliderWidth * this.max);


        this.snapPosition();
        this.setPosition(false);
    }

    setPrev() {
        console.log('prev');
        if (this.id>0) {
            this.id--;
        }
        this.snapPosition();
        this.setPosition(true);
    }
    setNext() {
        console.log('next');
        if (this.id< (this.max-1)) {
            this.id++;
        }
        this.snapPosition();
        this.setPosition(true);
    }

    snapPosition() {
        this.x = (this.id * -this.sliderWidth);
    }

    setPosition(isAnimation) {
        // console.log(this.id);
        let css = {};
        if (isAnimation) {
            css.transition = 'transform 0.5s ease-out';
        } else {
            css.transition = 'unset';
        }
        css.transform = 'translate3d(' + this.x + 'px, 0, 0)';
        this.el.find('ul').css(css );
    }

    mouseDownHandler(e) {
        e.preventDefault();
        // console.log('down');
        this.isDrag =true;
        this.firstX = e.clientX;
        this.startX = e.clientX;
    }

    mouseMoveHandler(e) {
        if (!this.isDrag) return;
        // console.log('move');
        // let offsetX = e.clientX * 1.5;
        let moveX = (this.startX - e.clientX)*1.5;
        this.startX = e.clientX;
        this.x -= moveX;

        this.setPosition(false);
    }

    mouseUpHandler(e) {
        // console.log('up');
        this.isDrag= false;

        if ((this.firstX - e.clientX) > 10 ) {
            this.setNext();
        } else if ((this.firstX - e.clientX) < 10 ) {
            this.setPrev();
        }

        //좌표 기준으로 id
        // this.id = Math.abs(Math.round((this.x/this.sliderWidth)));

        this.snapPosition();
        this.setPosition(true);
    }

    mouseLeaveHandler(e) {
        // console.log('leave');
        this.isDrag= false;
        this.snapPosition();
        this.setPosition(true);
    }
}
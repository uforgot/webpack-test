export default class Slider {
    constructor(el) {
        this.el = el;
        this.idx = 0;
        this.maxLen = this.el.find('.slider-item').length;
        this.positionX = 0;

        this.isDrag = false;
        this.startX = 0;
        this.distanceX = 0;

        this.addEvent();
    }

    addEvent() {
        this.setIndicator();
        this.resizeHandler();

        window.addEventListener('resize', (e)=>{this.resizeHandler(e);})
        this.el.on('mousedown', (e)=>{this.mouseDownHandler(e);})
        this.el.on('mousemove', (e)=>{this.mouseMoveHandler(e);})
        this.el.on('mouseup', (e)=>{this.mouseUpHandler(e);})
        this.el.on('mouseleave', (e)=>{this.mouseLeaveHandler(e);})

        this.el.on('touchstart', (e)=>{this.touchStartHandler(e)})
        this.el.on('touchmove', (e)=>{this.touchMoveHandler(e)})
        this.el.on('touchend', (e)=>{this.touchEndHandler(e)})

        this.el.find('.btn-prev').on('click', (e)=>{this.goPrev();});
        this.el.find('.btn-next').on('click', (e)=>{this.goNext();});
        this.el.find('.btn-indicator').on('click', (e)=>{this.onClickIndicator(e);});
    }

    setIndicator() {
        this.indiLen = this.maxLen;

        for(let i =0; i <this.indiLen; i++) {
            console.log(i)
            if(i === 0) {
                document.querySelector(".indicator-wrap").insertAdjacentHTML('beforeend', '<li class="current"><button class="btn-indicator"><span class="blind">' + 'indicator ' + i + '</span></button></li>')
            } else  {
                document.querySelector(".indicator-wrap").insertAdjacentHTML('beforeend', '<li><button class="btn-indicator"><span class="blind">' + 'indicator ' + i + '</span></button></li>')
            }
        }
    }

    controlIndicator(followingIdx) {
        this.el.find('.indicator-wrap li').removeClass('current');
        this.el.find('.indicator-wrap li').eq(followingIdx).addClass('current');
    }

    resizeHandler() {
        //slider 컨테이너 넓이
        this.sliderWrapWidth = this.el.width();

        //slider item 넓이
        this.sliderItemWidth = this.sliderWrapWidth;
        this.el.find('.slider-item').width(this.sliderItemWidth);

        //slider item list 넓이
        this.sliderItemListWidth = this.sliderItemWidth * this.maxLen;
        this.el.find('.slider-view').width(this.sliderItemListWidth);

        // slider x값 조절
        this.getDestination();
        this.movePosition(false);
    }

    goPrev() {
        console.log('click prev');

        if(this.idx > 0){
            this.idx--;
        }

        this.getDestination();
        this.movePosition(true);
    }

    goNext() {
        console.log('click next');

        if(this.idx < this.maxLen -1){
            this.idx++;
        }

        this.getDestination();
        this.movePosition(true);
    }

    onClickIndicator(e) {
        let targetListItem = e.target.parentNode;

        //console.log(e.target.parentNode);
        this.getIndicatorIdx(targetListItem);
        this.getDestination();
        this.movePosition(true);
    }

    getIndicatorIdx(target){
        let targetEl = target;

        for(let i = 0; i < targetEl.parentNode.childNodes.length; i++) {
            console.log(targetEl.parentNode.childNodes[i], targetEl)
            console.log(targetEl.parentNode.childNodes[i] === targetEl)

            if (targetEl.parentNode.childNodes[i] === targetEl) {
                this.idx = i;
                console.log(i);
            }
        }
    }

    getDestination() {
        this.positionX = -(this.idx * this.sliderItemWidth);
        //console.log(this.positionX)
    }

    movePosition(isAnimation) {
        let css = {};

        if (isAnimation) {
            css.transition = 'transform 0.5s ease-out';
        } else {
            css.transition = 'unset';
        }

        css.transform = 'translate3d(' + this.positionX + 'px, 0, 0)';
        this.el.find('.slider-view').css(css);

        this.controlIndicator(this.idx);
    }

    mouseDownHandler(e) {
        e.preventDefault();

        this.isDrag =true;

        this.firstX = e.clientX;
        this.startX = e.clientX;
    }

    mouseMoveHandler(e) {
        if(!this.isDrag) {
          return false;
        }else {
            console.log ('on drag', this.startX, e.clientX, this.firstX - e.clientX);
        }
        let movedX = (this.startX - e.clientX)*1.2;
        this.startX = e.clientX;
        this.positionX = this.positionX - movedX;
        this.movePosition(false);

    }

    mouseUpHandler(e) {
        this.isDrag= false;

        if ((this.firstX - e.clientX) > 100) {
            this.goNext();
        } else if ((this.firstX - e.clientX) < -100) {
            this.goPrev();
        }

        this.getDestination();
        this.movePosition(true);
    }

    mouseLeaveHandler(e) {
        this.isDrag= false;
        this.getDestination();
        this.movePosition(true);
    }

    touchStartHandler(e) {
        console.log('touch start');
        //this.firstX에 터치가 시작된 위치 저장
        this.firstX = e.originalEvent.touches[0].clientX;
        this.startX = e.originalEvent.touches[0].clientX;
        console.log(this.firstX, this.startX)
    }

    touchMoveHandler(e) {
        console.log('touch move');
        let movedX = (this.startX - e.originalEvent.touches[0].clientX)*1.2;
        //console.log(this.firstX + '-' + e.originalEvent.touches[0].clientX + '=' + distanceX);

        this.startX = e.originalEvent.touches[0].clientX;
        this.positionX = this.positionX - movedX;

        this.movePosition();
    }

    touchEndHandler(e) {
        console.log('touch end')
        //this.firstX에 터치가 끝난 위치 저장
        this.lastX = e.originalEvent.changedTouches[0].clientX
        this.distanceX = this.firstX - this.lastX;

        //console.log(this.firstX, this.lastX, this.distanceX, Math.abs(this.distanceX));


        if (Math.abs(this.distanceX) < 100) {
            this.getDestination();
            this.movePosition(true);
        }

        if (this.distanceX > 100) {
            this.goNext();
        } else if (this.distanceX < -100) {
            this.goPrev();
        }
    }

    /*
    getCoordinatePosition(e) {
        let x,y;

        if (e.type.split('touch').length > 1) {
            x = e.touches[0].clientX;
            y = e.touches[0].clientY;
        } else {
            x = e.clientX;
            y = e.clientY;
        }

        return {x:x, y:y};
    }
    */
}

export default class Slider {
    constructor(el) {
        this.el = el;
        this.idx = 0;
        this.maxLen = this.el.find('.slider-item').length;
        this.positionX = 0;

        this.indiArr = [];

        this.isDrag = false;
        this.startX = 0;
        this.distanceX = 0;

        fetch('static/data/data.json')
            .then(response => response.json())
            .then(data => {
                // Do something with your data
                console.log(data);
                console.log(data.list[0].img);
            });

        this.addEvent();
    }

    addEvent() {
        this.setDataIdx();
        //this.setIndicator();
        //this.getIndicatorItem();
        this.setIndicatorItem();
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

    // 리스트에 데이터 인덱스 값 붙여주기
    setDataIdx() {
        for(let i =0; i <this.maxLen; i++) {
            //console.log('set attr', document.querySelectorAll('.slider-view li')[i]);
            document.querySelectorAll('.slider-view li')[i].setAttribute('date-index', "'"+i+"'");
        }
    }

    // 인디케이터 마크업 생성 (구버전)
    setIndicator() {
        this.indiLen = this.maxLen;

        for(let i =0; i <this.indiLen; i++) {
            if(i === 0) {
                document.querySelector(".indicator-wrap").insertAdjacentHTML('beforeend',
                    '<li class="current"><button class="btn-indicator"><span class="blind">' + 'indicator ' + i + '</span></button></li>'
                )
            } else  {
                document.querySelector(".indicator-wrap").insertAdjacentHTML('beforeend',
                    '<li><button class="btn-indicator"><span class="blind">' + 'indicator ' + i + '</span></button></li>'
                )
            }
        }
    }

    // 인디케이터 마크업 생성
    getIndicatorItem(i) {
        let templateEl = $('script[data-template="indicator-item"]').text();
        let templateElArray = [];

        templateElArray.push(templateEl.split('${')[0]);
        templateElArray.push(i+1);
        templateElArray.push(templateEl.split('}')[1]);
        //console.log(templateElArray);

        return templateElArray.join('');
    }

    // 인디케이터 마크업 붙여넣기
    setIndicatorItem(){
        this.indiLen = this.maxLen;

        for(let i =0; i <this.indiLen; i++) {
            //console.log(this.getIndicatorItem(i));
            // this.indiArr.push(this.getIndicatorItem(i));
            let tmpIndiEl = this.getIndicatorItem(i);

            document.querySelector(".indicator-wrap").insertAdjacentHTML('beforeend',
                tmpIndiEl
            )
        }
    }

    // 인디케이터 클래스 제어
    controlIndicator(followingIdx) {
        //this.el.find('.indicator-wrap li').removeClass('current');
        //this.el.find('.indicator-wrap li').eq(followingIdx).addClass('current');

        let indicators = document.querySelectorAll(".indicator-wrap li");

        for(let i =0; i <this.indiLen; i++) {
            indicators[i].classList.remove('current');
        }

        indicators[followingIdx].classList.add('current');
    }

    // 리사이즈
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

        for(let i = 0; i < targetEl.parentNode.children.length; i++) {
            //console.log(targetEl.parentNode.children[i], targetEl)
            //console.log(targetEl.parentNode.children[i] === targetEl)

            if (targetEl.parentNode.children[i] === targetEl) {
                this.idx = i;
                //console.log(i);
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

        console.log(this.getCoordinatePosition(e).x, this.getCoordinatePosition(e).y)

        this.firstX = this.getCoordinatePosition(e).x;
        this.startX = this.getCoordinatePosition(e).x;
    }

    mouseMoveHandler(e) {
        if(!this.isDrag) {
          return false;
        }else {
            //console.log ('on drag', this.startX, this.getCoordinatePosition(e).x, this.firstX - this.getCoordinatePosition(e).x);
        }
        let movedX = (this.startX - this.getCoordinatePosition(e).x)*1.2;
        this.startX = this.getCoordinatePosition(e).x;
        this.positionX = this.positionX - movedX;
        this.movePosition(false);

    }

    mouseUpHandler(e) {
        this.isDrag= false;

        if ((this.firstX - this.getCoordinatePosition(e).x) > 100) {
            this.goNext();
        } else if ((this.firstX - this.getCoordinatePosition(e).x) < -100) {
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
        //console.log('touch start');
        this.getCoordinatePosition(e);
        //this.firstX에 터치가 시작된 위치 저장
        this.firstX = e.originalEvent.touches[0].clientX;
        this.startX = e.originalEvent.touches[0].clientX;
    }

    touchMoveHandler(e) {
        //console.log('touch move');
        let movedX = (this.startX - e.originalEvent.touches[0].clientX)*1.2;
        //console.log(this.firstX + '-' + e.originalEvent.touches[0].clientX + '=' + distanceX);

        this.startX = e.originalEvent.touches[0].clientX;
        this.positionX = this.positionX - movedX;

        this.movePosition();
    }

    touchEndHandler(e) {
        //console.log('touch end')
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

    // 마우스, 터치 디바이스별 좌표값 구하기
    getCoordinatePosition(e) {
        let x,y;

        //console.log(e.type.split('touch'))

        if (e.type.split('touch').length > 1) {
            x = e.originalEvent.touches[0].clientX;
            y = e.originalEvent.touches[0].clientY;
        } else {
            x = e.clientX;
            y = e.clientY;
        }

        return {x:x, y:y};
    }

}

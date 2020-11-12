export default class slider_v2 {
    constructor(el) {
        this.el = el;
        this.idx = 0;
        this.srcLocation = 'static/img/'
        this.isOnTransition = false;
        this.positionX = 0;

        fetch('static/data/data.json')
            .then(response => response.json())
            .then(data => {
                // 데이터에서 이미지 개수 가져오기
                this.maxLen = data.slideList.length;

                // 슬라이더 이미지 배열
                this.sliderImgArray = [];

                // 슬라이더 이미지 대체 텍스트 배열
                this.sliderImgAltArray = [];

                // 슬라이더 이미지 배열에 이미지 이름 담기
                for(let i =0; i < this.maxLen; i++) {
                    this.sliderImgArray.push(data.slideList[i].img)
                    this.sliderImgAltArray.push(data.slideList[i].alt)
                }

                console.log('get data complete');
                this.addEvent();
            });
    }

    addEvent() {
        this.setSliderItems();
        this.setIndicatorItems();
        this.setDefaultCurrent();

        window.addEventListener('resize', (e)=>{this.resizeHandler(e);})

        this.el.find('.btn-prev').on('click', (e)=>{this.onClickPrev();});
        this.el.find('.btn-next').on('click', (e)=>{this.onClickNext();});
        this.el.find('.btn-indicator').on('click', (e)=>{this.onClickIndicator(e);});

        //this.el.find('.slider-view').on('mousedown', (e)=>{this.onMouseDown(e);})
        //this.el.find('.slider-view').on('mousemove', (e)=>{this.onMouseMove(e);})
        //this.el.find('.slider-view').on('mouseup', (e)=>{this.onMouseUp(e);})
        //this.el.find('.slider-view').on('mouseleave', (e)=>{this.onMouseLeave(e);})
    }

    // 슬라이더에 넣을 마크업 가져오기
    getSliderItems(idx) {
        let sliderEl = $('script[data-template="slide-item"]').text();
        let sliderElArray = [];

        sliderElArray.push(sliderEl.split('$data')[0]);
        sliderElArray.push(this.srcLocation + this.sliderImgArray[idx]);
        sliderElArray.push(sliderEl.split('$data')[1]);
        sliderElArray.push(this.sliderImgAltArray[idx]);
        sliderElArray.push(sliderEl.split('$data')[2]);

        return sliderElArray.join('');
    }

    // 슬라이더에 마크업 생성
    setSliderItems() {
        for(let i =0; i < this.maxLen; i++) {
            let target = document.querySelector(".slider-view")
            let tmpSliderEl = this.getSliderItems(i);

            target.insertAdjacentHTML('beforeend', tmpSliderEl);
        }
    }

    // 인디케이터에 넣을 마크업 가져오기
    getIndicatorItems(idx) {
        let sliderEl = $('script[data-template="indicator-item"]').text();
        let sliderElArray = [];

        sliderElArray.push(sliderEl.split('${num}')[0]);
        sliderElArray.push(this.srcLocation + this.sliderImgArray[idx]);
        sliderElArray.push(sliderEl.split('${num}')[1]);

        return sliderElArray.join('');
    }

    // 인디케이터 마크업 생성
    setIndicatorItems() {
        for(let i =0; i < this.maxLen; i++) {
            let target = document.querySelector(".indicator-wrap")
            let tmpIndicatorEl = this.getIndicatorItems(i);

            target.insertAdjacentHTML('beforeend', tmpIndicatorEl);
        }
    }

    // 초기 current값 세팅
    setDefaultCurrent() {
        let slides = document.querySelectorAll(".slider-view li");
        let indicators = document.querySelectorAll(".indicator-wrap li");

        slides[this.idx].classList.add('current');
        indicators[this.idx].classList.add('current');
    }

    // next 버튼 클릭
    onClickPrev() {
        if (this.isOnTransition === true) {
            return false;
        }

        // 다음에 올 이미지 세팅
        this.setFollowingSlides();

        if (this.idx > 0){
            this.idx--;
        } else {
            this.idx = this.maxLen - 1
        }

        // 인디케이터 세팅
        this.setFollowingIndicators();

        // 이미지 이동 트랜지션
        this.onMovePosition(true, 'prev', false);
    }

    // next 버튼 클릭
    onClickNext() {
        if (this.isOnTransition === true) {
            return false;
        }

        // 다음에 올 이미지 세팅
        this.setFollowingSlides();

        if (this.idx < this.maxLen -1){
            this.idx++;
        } else {
            this.idx = 0;
        }

        // 인디케이터 세팅
        this.setFollowingIndicators();

        // 이미지 이동 트랜지션
        this.onMovePosition(true, 'next', false);
    }

    // 인디케이터 클릭 이벤트
    onClickIndicator(e) {
        let targetListItem = e.target.parentNode;
        let currentIdx = this.idx;

        this.getIndicatorIdx(targetListItem);
        this.setFollowingIndicators();
        console.log(currentIdx, this.idx)

        if (this.idx === currentIdx) {
            return false;
        } else {
            this.setFollowingSlides('shortcut', this.idx > currentIdx);
        }

         if (this.idx > currentIdx) {
            this.onMovePosition(true, 'next', false);
        } else  {
            this.onMovePosition(true, 'prev', false);
        }

    }

    // 인디케이터 idx 값 가져오기
    getIndicatorIdx(target){
        let targetEl = target;

        for(let i = 0; i < targetEl.parentNode.children.length; i++) {

            if (targetEl.parentNode.children[i] === targetEl) {
                this.idx = i;
            }
        }
    }


    // 다음 인디케이터 값 세팅하기
    setFollowingIndicators() {
        let indicators = document.querySelectorAll(".indicator-wrap li");
        let maxIdx = this.maxLen - 1;

        for(let i =0; i <this.maxLen; i++) {
            indicators[i].classList.remove('current');
        }

        indicators[this.idx].classList.add('current');
    }

    // 다음 슬라이드 값 세팅하기
    setFollowingSlides(type, fromRight) {

        console.log('다음 슬라이더 세팅', this.idx);

        let slides = document.querySelectorAll(".slider-view li");
        let maxIdx = this.maxLen - 1;

        for(let i =0; i <this.maxLen; i++) {
            slides[i].classList.remove('prev');
            slides[i].classList.remove('next');
        }

        if (type === 'shortcut') {
            //인디케이터 클릭 이동일 경우
            let targetIdxShortcut = this.idx;

            if(targetIdxShortcut === 0) {

                slides[targetIdxShortcut].classList.add('prev');

            } else if(targetIdxShortcut > 0 && targetIdxShortcut < maxIdx) {

                console.log(fromRight);
                if (fromRight ===  true) {
                    slides[targetIdxShortcut].classList.add('next');
                } else {
                    slides[targetIdxShortcut].classList.add('prev');
                }

            } else if(targetIdxShortcut === maxIdx) {

                slides[targetIdxShortcut].classList.add('next');

            }

        } else {
            let targetIdx = this.idx;

            if(this.idx === 0) {

                slides[maxIdx].classList.add('prev');
                slides[targetIdx + 1].classList.add('next');

            } else if(targetIdx > 0 && targetIdx < maxIdx) {

                slides[targetIdx - 1].classList.add('prev');
                slides[targetIdx + 1].classList.add('next');

            } else if(targetIdx === maxIdx) {

                slides[targetIdx - 1].classList.add('prev');
                slides[0].classList.add('next');

            }

        }

    }

    // current 슬라이드 재설정
    setCurrentSlides() {
        console.log('현재 슬라이더 재설정', this.idx);

        let slides = document.querySelectorAll(".slider-view li");
        let maxIdx = this.maxLen - 1;

        for(let i =0; i <this.maxLen; i++) {
            slides[i].classList.remove('current');
            slides[i].classList.remove('prev');
            slides[i].classList.remove('next');
        }

        slides[this.idx].classList.add('current');
    }


    // 슬라이드 포지션 이동 트랜지션
    onMovePosition(isAnimation, direction, isTouch) {
        this.isOnTransition = true;

        let css = {};
        let sliderWrapWidth = this.el.width();

        if (isAnimation) {
            css.transition = 'transform 0.5s ease-out';
        } else {
            css.transition = 'unset';
        }

        if (isTouch === true) {
            console.log('isTouch', this.positionX)

            css.transform = 'translate3d(' + this.positionX + 'px, 0, 0)';
            this.el.find('.slider-item.current, .slider-item.prev, .slider-item.next').css(css.transform);

        } else {
            console.log('isNotTouch');
            if (direction === 'next') {
                this.positionX = -sliderWrapWidth;
            } else if (direction === 'prev') {
                this.positionX = sliderWrapWidth
            }

            css.transform = 'translate3d(' + this.positionX + 'px, 0, 0)';
            this.el.find('.slider-item.current').css(css);
            this.el.find('.slider-item.prev').css(css);
            this.el.find('.slider-item.next').css(css);

            let onTransitionEl = document.querySelector('.current');

            onTransitionEl.ontransitionend = () => {
                this.el.find('.slider-item.current, .slider-item.prev, .slider-item.next').css({transition:'unset', transform:'none'});
                this.setCurrentSlides();
                this.isOnTransition = false;
            }

        }
    }

    onMouseDown(e) {
        console.log('mouse down');
        e.preventDefault();

        this.isDrag = true;

        //console.log(this.getLocation(e).x, this.getLocation(e).y)

        this.firstX = this.getLocation(e).x;
        this.startX = this.getLocation(e).x;
        this.setFollowingSlides();
    }

    onMouseMove(e) {
        if(!this.isDrag) {
            return false;
        }else {
            //console.log ('on drag', this.startX, this.getLocation(e).x, this.firstX - this.getLocation(e).x);
        }

        let movedX = (this.startX - this.getLocation(e).x)*1.2;
        this.startX = this.getLocation(e).x;
        this.positionX = this.positionX - movedX;
        this.onMovePosition(false, '', true);
    }

    onMouseUp(e) {
        this.isDrag= false;
        let distance = (this.el.width()/10)
        console.log(distance);

        if ((this.firstX - this.getLocation(e).x) > distance) {
            this.onMovePosition(true, 'next', true);
        } else if ((this.firstX - this.getLocation(e).x) < -distance) {
            this.onMovePosition(true, 'prev', true);
        }
    }

    onMouseLeave(e) {
        this.isDrag= false;
        this.onMovePosition(true);
    }

    getLocation(e) {
        let x,y;

        if(e.type.split('touch').length > 1) {
            x = e.originalEvent.touches[0].clientX;
            y = e.originalEvent.touches[0].clientY;
        } else  {
            x = e.clientX;
            y = e.clientY;
        }
        return {x:x, y:y};
    }
}

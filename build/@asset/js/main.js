const isMobile = (navigator.userAgent.indexOf('Mobi') > -1) ? true : false;

const slider = function(){
    let $slider = $('.visual-slide');
    let $item = $slider.find('.visual-item');
    
    if($item.length > 1){
        $slider.one('init', function(){
            let $firstItem = $item.eq(0);
            let bg = $firstItem.data('bg');

            bg && $('.kv-visual').css('background', bg);
        });
        $slider.slick({ dots: true });
        $slider.on('beforeChange', function(event, slick, curr, next){
            let $nextItem = slick.$slides.eq(next);
            let bg = $nextItem.data('bg');

            $('.kv-visual').removeAttr('style');
            bg && $('.kv-visual').css('background', bg);

        });
        
    }
};

const sorting = function(){
    let $sortList = $('.sort-list');
    let $sortItem = $sortList.find('li');
    let initCate = $('.sort-cate .btn-sort').eq(0).data('cate');
    let initArray= [];

    const init = function(){
        $sortItem.each(function(){
            let _this = $(this);
            initArray.push(_this.data('sort'));
        });

        addEvent();
    }

    const sort = function(el){
        let _this = $(el);
        let cate = _this.data('cate');
        let sortingArray = [];

        $sortItem.removeAttr('style');
        
        if(initCate == cate) return false;
        
        initArray.forEach(function(str, i){
            if(str.indexOf(cate) == -1) {
                sortingArray.push(str) ;
                $sortItem.eq(i).hide();
            }
        });
    }

    const addEvent = function(){
        $('.btn-sort').on('click', function(e){
            e.preventDefault();
            sort(this);

            let $parent = $(this).parent();
            $parent.addClass('active').siblings().removeClass('active')
        });
    }

    init();

}


$(document).ready(function(){
    
    slider();
    sorting();

});
const base_url = location.href;

const modals = (function(){
    let $wrap = $('#wrap');
    let $modals = $('<div class="modals" />');

    const open = function(el){
        if($modals == null) $modals = $('<div class="modals" />');
        
        let modalCode = $(el).data('modal');
        
        $wrap.append($modals);
        $modals.load( base_url + '/modals/'+ modalCode +'.html #modal_'+ modalCode, function(){
            $modals.addClass('show');
            setTimeout(function(){
                let $btnClose = $modals.find('.modal_close');
                $btnClose.focus();
            }, 500);
        });

    }
    const close = function(){
        $modals.removeClass('show');
        setTimeout(function(){
            $modals.remove();
            $modals = null;
        },500);
    }

    return {
        open: open,
        close: close
    }
})();

const userMenu = function(){
    let $headerNav = $('.header__nav');
    let $btn = $headerNav.find('.user-menu');
    
    $btn.on('click', function(e){
        e.preventDefault();
        let _this = $(this);
        
        if($headerNav.hasClass('on')){
            _this.attr('title', 'open');
            $headerNav
                .removeClass('on')
                .find('.header__nav-list').removeClass('show');
        }else{
            _this.attr('title', 'close');
            $headerNav
                .addClass('on')
                .find('.header__nav-list').addClass('show');
        }
    })

}

$(document).ready(function(){
    
    $('.btn_modal').on('click', function(e){
        e.preventDefault();
        modals.open(this);
    });

    $('#wrap').on('click', '.modal_close', function(e){
        e.preventDefault();
        modals.close();
    });

    userMenu();
});
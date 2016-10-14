// responsive tooltip
(function( $ ){
    $.fn.tooltip = function() {

        $('.action_show_error').click(function(){

            if ($(this).parent().hasClass('show_alert'))
            {
                $(this).parent().removeClass('show_alert');
            }
            else
            {
                $('.box_action_show_error').removeClass('show_alert');
                $(this).parent().addClass('show_alert');
            }
            return false;
        });
    };
})( jQuery );

(function( $ ){
    $.fn.toggleOpen = function() {

        $(".panel-heading.slide").click(function(){

            $(this).toggleClass('open');

        });

        var elem = $('.height-full a');

        $(elem).click(function(){



            elem.not(this).parent().removeClass('open');
            elem.not(this).parent().parent().parent().next('.panel-body.slide').slideUp();

            if ( $(this).parent().hasClass('open') ) {

                $(this).parents().eq(2).next('.panel-body.slide').slideUp();
                $(this).parent().removeClass('open');

            }else{

                $(this).parents().eq(2).next('.panel-body.slide').slideDown();
                $(this).parent().addClass('open');
            }

               //$(this).parents().eq(2).next('.panel-body.slide').slideToggle('fast');
               //$(this).parent().toggleClass('open');

           });

        $('[data-toggle="popover"]').popover();
    };

})( jQuery );

/*
(function( $ ){
    $.fn.widthInputBirtdate = function() {

        var widthDiv = $('.form-group.birthdate > div').width();
        var widthInput = (widthDiv - 26) / 3; //26 = 6px de border + 20px de margin
        var widthInputPercent = widthInput * 100 / widthDiv;

        $('.form-group.birthdate input').css( 'width', widthInputPercent + '%' );
    };

})( jQuery );
*/
(function( $ ){
    $.fn.showSubMenu = function() {

    	var height = $('body').find('.container-fluid').height() - 126;
    	var overlay = $('<div class="overlay"></div>');

        $('.nav-list li a').on('click', function(event) {

            var hasSubMenu = $(this).next().hasClass('panel-sousmenu-wrap');
            var subMenu = $(this).next('.panel-sousmenu-wrap');

            var action = (hasSubMenu && subMenu.css('display') == 'none' ? 'open' : 'close');

            $('.nav-list li a').removeClass('active').addClass("openMenu");
            $('.panel-sousmenu-wrap').hide();
            $(this).addClass('active');
            event.stopPropagation();
            $('.overlay').remove();

            if (hasSubMenu) {
                if (action === 'open') {
                    subMenu.show();
                    $('body').find('.container-fluid').append(overlay);
                    overlay.height(height);
                    $('#bandeau_cookie').find('.overlay').remove();
                } else {
                    $(this).removeClass('active');
                }
            } else {
                $(this).toggleClass("openMenu");
            }

            $('.panel-sousmenu-wrap .btn-close').add(overlay).on('click', function() {
                $('.overlay').remove();
                subMenu.hide();
                $('.nav-list li a').removeClass('active');
            });

            $(this).toggleClass("openMenu");
        });
    };
})( jQuery );

(function( $ ){

    $.fn.showMobileNav = function() {

        var btMenu = $('.menu-btn');
        var navCol = $('.navigation');
        var container = $('.container-fluid');
        var headerFix = $('.header-fix');

        btMenu.click( function(event){
            event.preventDefault();

             if ( $(this).hasClass("closed") ) {
                    navCol.stop().animate(
                        {
                            left: 0
                            }, 250
                        );
                    container.stop().animate(
                        {
                            'right' : -248
                        }, 250
                    );
                    headerFix.stop().animate (
                        {
                            'margin-left' : 248
                           }, 250
                        );
             }
             else{
                navCol.removeAttr('style');
                container.removeAttr('style');
                headerFix.removeAttr('style');
             }
                $(this).toggleClass("closed");
                return false;

        });
    };
})( jQuery );

function truncateString(str, length) {
   return str.length > length ? str.substring(0, length - 3) + '...' : str
}

$('.breadcrumb li').each(function(){

 var text = $(this).text();
 var truncText = truncateString(text, 45);

     if ($(this).children().length) {
        $(this).find('a').text(truncText);
     }else{
         $(this).text(truncText);
     }

 });


  $(document).ready(function(){

      $(this).toggleOpen(); // tools.js
      $(this).showSubMenu(); // Fonction show/hide submenu
      $(this).showMobileNav(); // Fonction show/hide submenu

      $('.open-nav-user-info').click(function() {
         $('.mobile-sous-menu').slideToggle();
      });                                             // Fonction show/hide submenu mobile (header)

      $('.box_open_close').click(function() {
         $('#box_nav_step_sub_menu').slideToggle();
      });

      $(function() {
	    $('.scroll-pane').jScrollPane();
      });

  });

$( window ).resize(function() {
       var btMenu = $('.menu-btn');
       var headerFix = $('.header-fix');

       if ( $(window).width() > 1200 ) {
           if (!btMenu.hasClass('closed')) {
               headerFix.removeAttr('style');
           }
       }
      if ( $(window).width() < 1200 ) {
         if (!btMenu.hasClass('closed')) {
             headerFix.css('margin-left', '248px');
         }
          //$(".panel-sousmenu-wrap").hide();
      }
       //$(this).widthInputBirtdate();
});

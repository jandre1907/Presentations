(function( $ ){
    $.fn.navStep = function() {

        //$('#box_nav_step_sub_menu').removeAttr("style");
        $('.box_open_close').css(
        {
            "transform":"rotate(180deg)"
        });
    };

})( jQuery );

// Extend media queries on click

(function( $ ){
    $.fn.dropDownStepBar = function() {

        $('#box_nav_step_action').unbind('click').click(function(){

            currentWidth = $('body').width();
            currentHeight_box_nav_step_sub_menu = $('#box_nav_step_sub_menu ol').outerHeight();

            $('#box_nav_step_sub_menu').css( "overflow", "hidden" );

            if (currentWidth < 992 )
            {
                if ($(this).closest('#box_nav_step').hasClass('box_nav_open'))
                {
                    $('.box_open_close').css({"transform":"rotate(180deg)"});

                    $('#box_nav_step_sub_menu').animate( { height:0 },200 );

                    $(this).closest('#box_nav_step').removeClass('box_nav_open');
                }
                else
                {
                    $('.box_open_close').css({"transform":"rotate(0deg)"});

                    $('#box_nav_step_sub_menu').animate( { height:currentHeight_box_nav_step_sub_menu },200 );

                    $(this).closest('#box_nav_step').addClass('box_nav_open');
                }
            }
            return false;
        });
    };
})( jQuery );


// Listen width
// (function( $ ){
//     $.fn.responsive = function() {

//         // var nbLi = jQuery('#box_nav_step_sub_menu li').length;
//         // var maxWidth = jQuery('#header_new').outerWidth();
//         // var outerWidthLi = Math.round(maxWidth - 30) / nbLi ;
//         // var widthLi = outerWidthLi - 20;

//         // var nbLiComplete = jQuery('#box_nav_step_sub_menu li.complete').length;
//         // var nbLiSelected = jQuery('#box_nav_step_sub_menu li.selected').length;

//         // var nbHere = nbLiComplete + 1;
//         // var widthProgressBar = outerWidthLi * nbHere;


//         // jQuery('#box_nav_step_sub_menu li').width( widthLi );
//         // jQuery('#box_nav_step_wherein_progressbar').width( widthProgressBar );

//     };

// })( jQuery );

// Extend media queries on resize

$( window ).resize(function() {

    $(this).navStep();
    //$(this).responsive();

});

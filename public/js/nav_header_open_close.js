jQuery( document ).ready(function($)
{
    $('.link_action_header_nav_menu').click(function()
    {
          $('.box_area_menu_content').toggleClass('close_sub_menu');
          $('.box_area_connected_content').addClass('close_sub_menu');
          return false;
    });

    $('.link_action_header_connected').click(function()
    {
          $('.box_area_connected_content').toggleClass('close_sub_menu');
          $('.box_area_menu_content').addClass('close_sub_menu');
          return false;
    });

    $('.action_box_nav_level_3').click(function()
    {
          $('.box_nav_level_3').toggleClass('close_sub_menu');
          $(this).parent().toggleClass('selected');
          return false;
    });


    $('html').click(function()
    {
        currentWidth = $('body').width();

        $('.box_nav_level_3').addClass('close_sub_menu');
        $('.action_box_nav_level_3').parent().removeClass('selected');

        if (currentWidth < 768 )
        {
            $('.box_area_menu_content').addClass('close_sub_menu');
            $('.box_area_connected_content').addClass('close_sub_menu');
        }

    });

});


$( document ).ready(function() {

    //
    // ASK FAQ PAGE
    //

        set_fields_match_object();

    if($('#info_file_loaded').text() !== '' && $('#file_widget_info').text() == '') {
        var info_file_loaded = $('#info_file_loaded').text();
        info_file_loaded = cutFilename(info_file_loaded, 15);
        $('#file_widget_info').text(info_file_loaded);
    }
    $('#joindre_un_fichier').change(function() {
        var uploaded_file_name = $(this).val();
        uploaded_file_name = cutFilename(uploaded_file_name, 15);
        $('#file_widget_info').text(uploaded_file_name);
    });

    function cutFilename(filename, length) {
        var extension = filename.split('.').pop();
        var cut_name = filename.split(extension);
        cut_name = cut_name[0];
        cut_name = cut_name.substring(0, length);
        test_filename = cut_name + '.' + extension;
        var dots = '';
        if(test_filename.length < filename.length) {
            dots = '...';
        }
        cut_name = cut_name + dots + extension;
        return cut_name;
    }


    // when changing the value of the object field
    $('#sel_ask_form_object').change(function() {
        if ($('#sel_ask_form_object').val() == '') {
            // object field is empty : go back to initial state hiding all the fields
            hide_all_fields();
        } else {

            // only show the field matching the object (motif) value
            set_fields_match_object();
        }

    });

    $('#sel_ask_form_section').change(function() {
        if($(this).val() == '5') {
            $('#form_hotline_popin').modal(); // modal js de bootstrap
            $(':submit').prop('disabled', true);
        } else {
            $(':submit').prop('disabled', false);
        }
    });

    $('#faq_close_popin').click(function() {
        $(this).parent().hide();
        $(':submit').prop('disabled', false);
        $('#sel_ask_form_section').val('');
    });

    function set_fields_match_object() {
        if ($('#sel_ask_form_object').val() == '0'){
            $('.form_package_form_group').show();
            $('#sel_ask_form_package').attr('required', 'required');
            $('.form_request_form_group').show();
            $('#sel_ask_form_request').attr('required', 'required');

            $('.form_attachment_form_group').show();

            $('.form_section_form_group').hide();
            $('#sel_ask_form_section').removeAttr('required');
            $('.form_description_form_group').hide();
            $('#sel_ask_form_description').removeAttr('required');

            $('#sel_ask_form_section').val('');

        }
        else if ($('#sel_ask_form_object').val() == '1')
        {
            // technical
            $('.form_description_form_group').show();
            $('#sel_ask_form_description').attr('required', 'required');
            $('.form_section_form_group').show();
            $('#sel_ask_form_section').attr('required', 'required');

            $('.form_attachment_form_group').show();

            $('.form_package_form_group').hide();
            $('#sel_ask_form_package').removeAttr('required');
            $('.form_request_form_group').hide();
            $('#sel_ask_form_request').removeAttr('required');

            $('#sel_ask_form_package').val('');

        } else {
            hide_all_fields();
        }
    }
    function hide_all_fields() {
        $('.form_package_form_group').hide();
        $('.form_section_form_group').hide();
        $('.form_attachment_form_group').hide();
        $('.form_description_form_group').hide();
        $('.form_request_form_group').hide();
    }

    function show_all_fields() {
        $('.form_package_form_group').show();
        $('.form_section_form_group').show();
        $('.form_attachment_form_group').show();
        $('.form_description_form_group').show();
        $('.form_request_form_group').show();
    }


//
// SEARCH PAGE
//

    $('.faq_them_checkbox').click(function() {
        var them_id = this.id;

        them_id = them_id.split('-');
        them_id = them_id[1];

        if(this.checked === true) {
            $('.row .cat' + them_id).show();
        } else {
            $('.row .cat' + them_id).hide();
        }
    }
    );

// POLL RADIOS
    $('#poll_yes').click(function() {
        $('#sel_selbundle_faqpoll_poll_choice_0').prop("checked", true);
        $('#faq_poll_form').submit();

    });

    $('#poll_no').click(function() {
        $('#sel_selbundle_faqpoll_poll_choice_1').prop("checked", true);
            $('#faq_poll_form').submit();
    });

    $('#faq_poll_form').find(':input').click(function() {});
    $('#faq_poll_form').find(':submit').hide();

});

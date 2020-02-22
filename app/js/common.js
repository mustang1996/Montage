$(function() {

	$("header nav ul").after("<div id='mmenu'>");
    $("header nav ul").clone().appendTo("#mmenu");
    $("#mmenu").mmenu({
        extensions:["pagedim-black","fx-menu-slide", "position-right"],
        navbar: {
            title: "Меню"
        },
        pageScroll  : {
            scroll      : true,
            update      : true
        }
    } );

    var mmAPI = $("#mmenu").data( "mmenu" );
    $(".toggle-mnu").click(function() {
        mmAPI.open();
    });
    mmAPI.bind('close:start', function (argument) {
        $(".toggle-mnu").removeClass("on");
    })
    mmAPI.bind('open:start', function (argument) {
        $(".toggle-mnu").addClass("on");
    })

    Waves.attach('a.btn, button.btn');
    Waves.init();

    $("form .phone").mask("+7(999)999-99-99");

    $('.fancy').fancybox();
    $('.fboxlink').fancybox();
    $(".fboxlink").click(function(){
        $(".fbox_form form")[0].reset();
        $(".fbox_form form").find('input[name="theme"]').val($(this).data('theme'));
        $(".fbox_form").find('.fbox_caption').html($(this).data('caption'));
    })


    $('#fbox_form form, form.contact_form').submit(function(argument) {
        var data = $(this).serialize();
        form=$(this);
        $.ajax({
            type: "POST",
            url: "/local/sender.php",
            dataType: 'json',
            data: data,
            success: function (data)
            {
                if (data.code==1)
                {
                    $.fancybox.close();
                    form[0].reset();
                }else
                {
                }
            }
        })
        return false;
    })

});

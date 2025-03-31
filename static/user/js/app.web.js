var inStock = false;

$(document).ready(function() {

    //$('.lazy').lazy();
    //Top search
    $('#kwd').autocomplete({
        serviceUrl: '/api/search',
        deferRequestBy: 200,
        maxHeight: 450,
        formatResult: autoComplateFormat,
        showLink: '/tim-kiem?kwd='
    });


    $('a[href^="#"]').on('click', function(event) {
        var target = $(this.getAttribute('href'));
        if (target.length) {
            event.preventDefault();
            $('html, body').stop().animate({
                scrollTop: target.offset().top - 10
            }, 1000);
        }
    });

    //Login modal
    $("#login-modal").click(function(event) {
        event.preventDefault();
        this.blur(); // Manually remove focus from clicked link.
        $.get(this.href, function(html) {
            $(html).appendTo('body').modal({
                escapeClose: false,
                clickClose: false,
                closeClass: 'icon-minutes',
                closeText: ' '
            });
        });
    });
    //Login
    $("#login-member").on('click', function(event) {
        event.preventDefault();
        this.blur(); // Manually remove focus from clicked link.

        $("#popup-modal").css({
            'width': ''
        }); //reset width
        $("#popup-modal").css({
            'height': ''
        }); //reset width
        $("#popup-modal").css({
            'padding': ''
        }); //reset width
        //get widthSetting;
        var setWidth = $(this).attr("data-width") != null ? $(this).attr("data-width") : "";
        var setHeight = $(this).attr("data-height") != null ? $(this).attr("data-height") : "";
        var setPadding = $(this).attr("data-padding") != null ? $(this).attr("data-padding") : "";

        $.get(this.href, function(html) {
            $("#popup-modal").html(html)
                .css({
                    'border-radius': '10px'
                })
                .css({
                    'padding': setPadding
                })
                .css({
                    'width': setWidth
                })
                .css({
                    'height': setHeight
                })
                .modal({
                    showClose: false,
                    escapeClose: false, // Ngừng đóng modal khi nhấn phím Esc
                    clickClose: false // Ngừng đóng modal khi click vào backdrop (vùng ngoài modal)
                });
        });
    });

    $(".ajax-modal").click(function(event) {
        event.preventDefault();
        this.blur(); // Manually remove focus from clicked link.

        $("#popup-modal").css({
            'width': ''
        }); //reset width
        $("#popup-modal").css({
            'padding': ''
        }); //reset width
        //get widthSetting;
        var setWidth = $(this).attr("data-width") != null ? $(this).attr("data-width") : "";
        var setPadding = $(this).attr("data-padding") != null ? $(this).attr("data-padding") : "";

        $.get(this.href, function(html) {
            $("#popup-modal").html(html)
                .css({
                    'width': setWidth
                })
                .css({
                    'padding': setPadding
                })
                .modal({
                    closeClass: 'icon-minutes',
                    closeText: ' '
                });
        });
    });

    //Fix header
    $("header nav").scrollToFixed({
        preFixed: function() {
            $(this).css('color', 'blue');
        },
        postFixed: function() {
            $(this).css('color', '');
        }
    });



    $('textarea').autoHeight();

    if ($("#reviews").length > 0)
        init_Review();

    if ($("#comments").length > 0)
        init_Comment();

    AddCart();
    quickOrder();
    quickSub();
    btnInstallment();
    checkCallbackUrl();
});

function checkCallbackUrl() {
    // Lấy toàn bộ URL hiện tại
    var url = window.location.href;

    // Kiểm tra query string 'param' có giá trị là '1' hay không
    var urlParams = new URLSearchParams(window.location.search); // Sử dụng URLSearchParams để làm việc với query string

    if (urlParams.has('ReturnUrl')) {
        $("#login-member").trigger("click");
    }
}

function hh_home() {
    $('.lr-slider').owlCarousel({
        items: 5,
        nav: true,
        itemClass: 'lr-item',
        loop: false,
        autoplay: true,
        autoplayHoverPause: true
    });

    testimonial_init();
}

window.jssor_1_slider_init = function() {

    var jssor_1_options = {
        $class: $JssorSlideshowRunner$,
        $AutoPlay: 1,
        $FillMode: 2,
        $SlideDuration: 500,
        $Idle: 10000,
        $ArrowNavigatorOptions: {
            $Class: $JssorArrowNavigator$
        },
        $ThumbnailNavigatorOptions: {
            $Loop: false,
            $Class: $JssorThumbnailNavigator$,
            $ChanceToShow: 4,
            $ActionMode: 1,
            $SpacingX: 0,
            $ParkingPosition: 0,
            $NoDrag: true,
            $Align: 2
        }
    };

    var jssor_1_slider = new $JssorSlider$("jssor_1", jssor_1_options);

    var MAX_WIDTH = 1200;

    function ScaleSlider() {
        var containerElement = jssor_1_slider.$Elmt.parentNode;
        var containerWidth = containerElement.clientWidth;

        if (containerWidth) {

            var expectedWidth = Math.min(MAX_WIDTH || containerWidth, containerWidth);
            jssor_1_slider.$ScaleWidth(expectedWidth);
        } else {
            window.setTimeout(ScaleSlider, 30);
        }
    }

    ScaleSlider();

    $Jssor$.$AddEvent(window, "load", ScaleSlider);
    $Jssor$.$AddEvent(window, "resize", ScaleSlider);
    $Jssor$.$AddEvent(window, "orientationchange", ScaleSlider);
    /*#endregion responsive code end*/
};

function hh_category() {


    $('.lrs-slider').owlCarousel({
        nav: true,
        itemClass: 'lr-item',
        loop: false,
        items: 8,
        autoplay: true,
        autoplayHoverPause: true,
        responsiveClass: true,
        margin: 10
    });


    window.jssor_1_slider_init = function() {

        var jssor_1_options = {
            $class: $JssorSlideshowRunner$,
            $AutoPlay: 1,
            $FillMode: 2,
            $SlideDuration: 500,
            $Idle: 10000,
            $ArrowNavigatorOptions: {
                $Class: $JssorArrowNavigator$
            },
            $ThumbnailNavigatorOptions: {
                $Loop: false,
                $Class: $JssorThumbnailNavigator$,
                $ChanceToShow: 4,
                $ActionMode: 1,
                $SpacingX: 0,
                $ParkingPosition: 0,
                $NoDrag: true,
                $Align: 2
            }
        };

        var jssor_1_slider = new $JssorSlider$("jssor_1", jssor_1_options);

        var MAX_WIDTH = 1200;

        function ScaleSlider() {
            var containerElement = jssor_1_slider.$Elmt.parentNode;
            var containerWidth = containerElement.clientWidth;

            if (containerWidth) {

                var expectedWidth = Math.min(MAX_WIDTH || containerWidth, containerWidth);
                jssor_1_slider.$ScaleWidth(expectedWidth);
            } else {
                window.setTimeout(ScaleSlider, 30);
            }
        }

        ScaleSlider();

        $Jssor$.$AddEvent(window, "load", ScaleSlider);
        $Jssor$.$AddEvent(window, "resize", ScaleSlider);
        $Jssor$.$AddEvent(window, "orientationchange", ScaleSlider);
        /*#endregion responsive code end*/
    };


    if ($('#jssor_1').length) {
        jssor_1_slider_init();
    }
}


testimonial_init = function() {
    $('.testimonial-slider').owlCarousel({
        items: 2,
        nav: true,
        itemClass: 'testimonial-item',
        loop: false,
        autoplay: true,
        autoplayHoverPause: true
    });
};


function marketFilters(id) {
    if (id == 0) {
        $("#marketFilter .store ul li.instock").removeClass("hide");
    } else {
        $("#marketFilter .store ul li").addClass("hide");
        $("#marketFilter .store ul li.city_" + id).removeClass("hide");
    }

    $("#marketFilter .list").addClass("hide");
    setTimeout(function() {
        $("#marketFilter .list").removeClass("hide");
    }, 50);

    $("#marketFilter .selected").removeClass("selected");
    $("#marketFilter #city_" + id).addClass("selected");

    var cityName = $("#marketFilter #city_" + id).text();
    $(".check-stock .button label").text(cityName);

    outStockMessage();
}



//Chức năng đặt hàng nhanh
function quickOrder() {
    //orderIP15();
    //$('.btnQuickOrder').off();
    $('.btnQuickOrder').click(function(event) {

        var disableClick = $('.btnQuickOrder').hasClass("disabled") || $('.btnQuickOrder').hasClass("btn-outstock");
        if (disableClick)
            return;


        var allAddOn = [];
        $("#product-addon-content .add-on-item input:checked").each(function() {
            allAddOn.push(parseInt($(this).val()));
        });

        var addOnId = allAddOn.join(',');
        var sku = $(this).attr('data-sku');
        var colorId = $('#colorOptions .selected').attr('data-id');
        var urlFormOrder = '/ajax/quickorder?skuId=' + sku;

        if (addOnId)
            urlFormOrder += '&addOnId=' + addOnId;

        if (colorId)
            urlFormOrder += '&colorId=' + colorId;

        event.preventDefault();
        this.blur(); // Manually remove focus from clicked link.
        $.get(urlFormOrder, function(html) {
            $('#popup-modal').html(html).modal({
                escapeClose: false,
                clickClose: false,
                closeClass: 'icon-minutes',
                closeText: ' '
            });
        });
    });




    ///Đặt mua hàng hộ
    $('.btnQuickRefOrder').click(function(event) {

        var disableClick = $('.btnQuickRefOrder').hasClass("disabled") || $('.btnQuickRefOrder').hasClass("btn-outstock");
        if (disableClick)
            return;

        var sku = $(this).attr('data-sku');
        var colorId = $('#colorOptions .selected').attr('data-id');
        var urlFormOrder = '/ajax/quickorder?ref=true&skuId=' + sku;
        if (colorId)
            urlFormOrder = '/ajax/quickorder?ref=true&skuId=' + sku + '&colorId=' + colorId;

        event.preventDefault();
        this.blur(); // Manually remove focus from clicked link.
        $.get(urlFormOrder, function(html) {
            $('#popup-modal').html(html).modal({
                escapeClose: false,
                clickClose: false,
                closeClass: 'icon-minutes',
                closeText: ' '
            });
        });
    });
}


//chức năng theo dõi thông tin
function quickSub() {
    $('.btnQuickSubscription').click(function(event) {

        var versionOption = $('#versionOption').attr('data-id');
        versionOption = versionOption ? versionOption : 0;
        var colorOption = $('#colorOptions div.selected').attr('data-id');
        colorOption = colorOption ? colorOption : 0;
        var productId = $(this).attr('data-id');
        var urlFormOrder = '/ajax/quickSub?productId=' + productId + '&versionId=' + versionOption + '&colorId=' + colorOption;
        event.preventDefault();
        this.blur(); // Manually remove focus from clicked link.
        $.get(urlFormOrder, function(html) {
            $('#popup-modal').html(html).modal({
                escapeClose: false,
                clickClose: false,
                closeClass: 'icon-minutes',
                closeText: ' '
            });
        });
    });
}




//slider content
sliderContent_init = function() {
    ///Chỉ đăng ký khi có sử dụng slider
    var hasSlider = $("#sliderContent").length;
    if (hasSlider) {

        var sliderContent_options = {
            $AutoPlay: true,
            $Idle: 600000,
            $DragOrientation: 3,
            $ArrowNavigatorOptions: {
                $Class: $JssorArrowNavigator$,
                $ChanceToShow: 2,
                $AutoCenter: 0,
                $Steps: 1
            },
            $BulletNavigatorOptions: {
                $Class: $JssorBulletNavigator$
            }
        };

        var sliderContent = new $JssorSlider$("sliderContent", sliderContent_options);

        /*responsive code begin*/
        /*you can remove responsive code if you don't want the slider scales while window resizing*/
        function ScaleSlider() {
            var refSize = sliderContent.$Elmt.parentNode.clientWidth;
            if (refSize) {
                refSize = Math.min(refSize, 1200);
                sliderContent.$ScaleWidth(refSize);
            } else {
                window.setTimeout(ScaleSlider, 30);
            }
        }
        ScaleSlider();
        $Jssor$.$AddEvent(window, "load", ScaleSlider);
        $Jssor$.$AddEvent(window, "resize", ScaleSlider);
        $Jssor$.$AddEvent(window, "orientationchange", ScaleSlider);
    }
    /*responsive code end*/
};


//Slider ảnh xem chi tiết
imagePreview_init = function() {
    var imagePreview_options = {
        $AutoPlay: true,
        $SlideDuration: 500,
        $Idle: 5000,
        $ArrowNavigatorOptions: {
            $Class: $JssorArrowNavigator$
        },
        $PauseOnHover: 1,
        $ThumbnailNavigatorOptions: {
            $Class: $JssorThumbnailNavigator$,
            $SpacingX: 10,
            $SpacingY: 5,
            $ArrowNavigatorOptions: {
                $Class: $JssorArrowNavigator$
            },
        }
    };

    var imagePreview = new $JssorSlider$("imagePreview", imagePreview_options);
    //Select
    var dfImage = $('#colorOptions div.selected').attr('data-idx');
    if (dfImage) {
        imagePreview.$GoTo(dfImage);
    }


    $("#versionOption").click(function() {
        $(this).find("a").click();
    });

    $('.slider-t-l').click(function() {
        imagePreview.$Prev();
    });

    $('.slider-t-r').click(function() {
        imagePreview.$Next();
    });

    $("#colorOptions > div").click(function() {
        $("#colorOptions .selected").removeClass("selected");
        $(this).addClass("selected");

        var SKU = $(this).attr("data-sku");
        $('.btnbuy').attr("data-sku", SKU);
        $('#dfSKU').html(SKU);

        //set all city, market hide
        $(".check-stock .city ul li.instock").not(".selected").removeClass("instock").addClass("outstock");
        $(".check-stock .city ul li[data-sku*='" + SKU + "']").removeClass("outstock").addClass("instock");
        $(".check-stock .store ul li").removeClass("instock").addClass("outstock");
        $(".check-stock .store ul li[data-sku*='" + SKU + "']").removeClass("outstock").addClass("instock");

        outStockMessage();

        var idxImg = $(this).attr("data-idx");
        imagePreview.$GoTo(idxImg);
        imagePreview.$Pause();


        var bestPrice = $(this).attr("data-bestPrice");
        var lastPrice = $(this).attr("data-lastPrice");
        var priceNote = $(this).attr("data-pricenote");
        var hotSaleNote = $(this).attr("data-hotsale");

        var priceHtml = '<strong>' + bestPrice + '</strong>';
        if (lastPrice != '')
            priceHtml += ' <i><strike>' + lastPrice + '</strike></i>';

        priceHtml += ' <i> | Giá đã bao gồm VAT</i>';
        priceHtml += hotSaleNote;

        if (priceNote != '')
            priceHtml += '<i>' + priceNote + '';

        //Update price
        $(".current-product-price").html(priceHtml);

        //Khi đổi màu, check lại avaialbe các nút đặt
        //AddCart();
        //quickOrder();

        //Tính lại giá sau thu cũ
        var renewPrice = $('.renewPrice').attr('data-val');
        if (renewPrice) {
            var supportPrice = parseInt(bestPrice.replace(/[^0-9]/g, "")) - renewPrice;
            $('.renewValue').html(supportPrice.toLocaleString('en-US') + ' ₫');
        }

        //Tính lại giá hỗ trợ event
        var extraPrice = $('.eventPrice').attr('data-extra');
        var eventPrice = $('.eventPrice').attr('data-val');
        var eventRate = $('.eventPrice').attr('data-rate');
        if (eventPrice || eventRate) {
            var extraDiscountPrice = parseInt(extraPrice.replace(/[^0-9]/g, ""));
            var normalPrice = parseInt(bestPrice.replace(/[^0-9]/g, ""));
            var eventPriceRate = eventRate > 0 ? (normalPrice * eventRate / 100) : 0;
            var eventPrice = eventPrice <= eventPriceRate || eventPriceRate == 0 ? eventPrice : eventPriceRate;

            eventPrice = upTo1000VND(eventPrice);

            var eventValue = normalPrice - eventPrice;
            eventValue = eventValue - extraDiscountPrice;
            $('.eventValue').html(eventValue.toLocaleString('en-US') + ' ₫');
        }
    });


    //Tính lại giá khi lẻ dưới 1000 đ
    function upTo1000VND(value) {
        return value % 1000 >= 500 ?
            value + 1000 - (value % 1000) :
            value - (value % 1000);
    }


    /*responsive code begin*/
    /*you can remove responsive code if you don't want the slider scales while window resizing*/
    function ScaleSlider() {
        var refSize = imagePreview.$Elmt.parentNode.clientWidth;
        if (refSize) {
            refSize = Math.min(refSize, 810);
            imagePreview.$ScaleWidth(refSize);
        } else {
            window.setTimeout(ScaleSlider, 30);
        }
    }
    ScaleSlider();
    $Jssor$.$AddEvent(window, "load", ScaleSlider);
    $Jssor$.$AddEvent(window, "resize", ScaleSlider);
    $Jssor$.$AddEvent(window, "orientationchange", ScaleSlider);

    $JssorSlider$.$EVT_STATE_CHANGE
    /*responsive code end*/
};


$(function() {
    $('form.login').on('submit', function(e) {
        e.preventDefault();

        var formData = $(this).serializeObject();
        console.log(formData);
        $('.datahere').html(formData);
    });
});
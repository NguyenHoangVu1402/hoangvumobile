var inStock = false;
var currrentPage = 1;
var loading = false;
$(document).ready(function() {
    showFLS_new($(".header .box-product-sale .actived").attr('data-id'));
});

// Xử lý cuộn trang -> stick header
let lastScrollTop = 0; // Vị trí cuộn trang trước đó
const header = $('header');

window.addEventListener('scroll', function() {
    let currentScroll = window.pageYOffset || document.documentElement.scrollTop;
    if (currentScroll > 100) {
        if (currentScroll > lastScrollTop) {
            // Nếu cuộn xuống, ẩn header
            header.addClass('hidden');
            $('.nav-full').removeClass('moveDown');
        } else {
            // Nếu cuộn lên, hiện lại header
            header.removeClass('hidden');
            $('.nav-full').addClass('moveDown');
        }
    }

    lastScrollTop = currentScroll <= 0 ? 0 : currentScroll; // Đảm bảo không cuộn qua phần đầu trang
});
// End header

//slider banner
imageSlick = function(imagePreviewSelector, imageThumbSelector) {

    var $imagePreview = $(imagePreviewSelector);
    var $imageThumb = $(imageThumbSelector);

    // Kiểm tra và khởi tạo carousel cho .slider-banner nếu tồn tại
    if ($imagePreview.length) {
        $imagePreview.slick({
            slidesToShow: 1, // Số slide cần hiển thị
            slidesToScroll: 1, // Số slide muốn cuộn
            arrows: true, // Hiển thị mũi tên điều hướng
            autoplay: false, // Chế độ tự động chạy
            autoplaySpeed: 30000, // Tự động chạy theo mini giây
            dots: false, // Hiển thị các chấm tròn thể hiện số trang
            pauseOnFocus: true,
            pauseOnHover: true,
            pauseOnDotsHover: true,
            asNavFor: $imageThumb, // Liên kết với carousel có class là .slick-thumb
            responsive: [{
                breakpoint: 768,
                settings: {
                    arrows: false // Loại bỏ mũi tên điều hướng ở breakpoint 768px
                }
            }],
            prevArrow: '<button type="button" data-role="none" class="slick-product-prev icon-leftar" aria-label="Previous" tabindex="0" role="button"></button>',
            nextArrow: '<button type="button" data-role="none" class="slick-product-next icon-rightar" aria-label="Next" tabindex="0" role="button"></button>'
        });

        $imagePreview.slick('setPosition');

        // Gắn sự kiện click bên trong slider-banner để đảm bảo không thay đổi kích thước
        $imagePreview.on('click', '.slick-slide', function(event) {
            event.stopPropagation();
        });
    }

    // Kiểm tra và khởi tạo carousel cho .slick-thumb nếu tồn tại
    if ($imageThumb.length) {
        var slidesToShow = 4; // Số slide cần hiển thị ban đầu
        var slideCount = $imageThumb.children().length;

        // Nếu số lượng slide ít hơn hoặc bằng slidesToShow thì disable transform
        if (slideCount <= slidesToShow) {
            $imageThumb.addClass('none-transform');
        }

        $imageThumb.slick({
            slidesToShow: slidesToShow, // Số slide cần hiển thị
            slidesToScroll: 1, // Số slide muốn cuộn
            asNavFor: $imagePreview, // Liên kết với carousel có class là .slider-banner
            centerMode: false, // Chế độ trung tâm
            focusOnSelect: true, // Tập trung vào việc lựa chọn
            arrows: false, // Không hiển thị mũi tên điều hướng
            infinite: false, // Không vô hạn lăp lại các slide
            dots: true,
            swipeToSlide: true, // Cho phép cuộn slide khi vuốt trên màn hình cảm ứng
        });
    }
}

function showFLS_new(flsId) {
    $('.flashsale-slick1').slick('slickUnfilter');
    $('.flashsale-slick1').slick('slickFilter', '.cat_' + flsId);
    $('.group-type').removeClass('actived');
    $('.cat_' + flsId).addClass('actived');
}

function PlayVideo(id, src) {
    var promptUrl = src;
    var videoPlayer = $('#video-player-' + id);
    videoPlayer.attr({
        'src': promptUrl,
        'type': 'video/mp4',
        'autoplay': 'autoplay',
        'loop': 'loop',
        'muted': 'muted',
        'playsinline': 'playsinline'
    });
}

function initVideoPlayer() {
    $(".auto-play").each(function(index, element) {
        // Change the text of each <li> element
        var id = $(element).attr("data-id");
        var src = $(element).attr("data-src");
        PlayVideo(id, src);
    });
}

function hh_home() {
    $('.lr-slider').owlCarousel({
        items: 4,
        nav: true,
        itemClass: 'lr-item',
        loop: false,
        autoplay: true,
        autoplayHoverPause: true
    });

    $('.v5-item a.auto-play-video').hover(function() {
        hoverTimeout = setTimeout(() => {
            var id = $(this).attr("data-id");
            if ($("#product-img-" + id).css("display") != "none") {
                var src = $("#video-player-" + id).attr("data-src");
                $(this).removeClass("auto-play-video");
                $("#play-icon-" + id).css("display", "none");
                $("#video-player-" + id).css("display", "block");
                $("#product-img-" + id).css("display", "none");
                PlayVideo(id, src);
            }
        }, 1000);
    });
    $('.v5-item a.auto-hide-img').hover(function() {

        var id = $(this).attr("data-id");
        if ($("#product-img-" + id).css("opacity") != "0") {
            $("#product-img-hide-" + id).css("display", "block");
            $("#product-img-hide-" + id).css("opacity", "1");
            $("#product-img-" + id).css("display", "none");
            $("#product-img-" + id).css("opacity", "0");
        }
    }, function() {
        var id = $(this).attr("data-id");
        if ($("#product-img-" + id).css("opacity") == "0") {
            $("#product-img-hide-" + id).css("display", "none");
            $("#product-img-hide-" + id).css("opacity", "0");
            $("#product-img-" + id).css("display", "block");
            $("#product-img-" + id).css("opacity", "1");
        }
    });

    $('.testimonial-slider').slick({
        draggable: true, // Cho phép kéo chuột để di chuyển slide
        swipe: true, // Cho phép vuốt trên màn hình cảm ứng (mobile)
        touchMove: true, // Cho phép kéo slide trên mobile
        autoplay: true, // Tự động chuyển slide (nếu cần)
        dots: true,
        arrows: false,
        autoplay: true,
        autoplaySpeed: 5000,
        infinite: true,
        speed: 300,
        slidesToShow: 2,
        slidesToScroll: 2,
        loop: true
    });
    $('.slide-deal-header').slick({
        autoplay: true,
        autoplaySpeed: 5000,
        dots: false,
        arrows: true,
        infinite: true,
        speed: 300,
        slidesToShow: 1,
        slidesToScroll: 1,
        loop: true
    });
    //Sản phẩm mua cùng
    $('.ref-product-slick').slick();
    $('.flashsale-slick1').slick();
    $('.timer').each(function(idx, el) {
        var dataId = $(this).attr('id');
        var dataStart = $(this).attr('data-start');
        var dataEnd = $(this).attr('data-end');
        timer(dataId, dataStart, dataEnd);
    });

    $('.head-filter ul li a').click(function() {
        var isShowAll = $(this).attr('data-show-all');
        var targetDiv = $(this).attr('data-id');
        targetDiv = '*[data-id^=' + targetDiv + ']';
        $('.head-filter ul li a').removeClass('active');
        $(this).addClass('active');


        $(".ref-product-slick").slick('slickUnfilter');
        if (!isShowAll) {
            $('.ref-product-slick').slick('slickFilter', targetDiv);
        }

    });

    //$('.ref-product-slick').on('init', function (event, slick) {
    //    $(this).show(); // Hiện slider khi khởi tạo xong
    //}).slick({
    //}).on('afterChange', function (event, slick, currentSlide) {
    //    // currentSlide là chỉ số của item đang active sau khi chuyển
    //    var activeItemText = $('.ref-product-slick .v5-item').eq(currentSlide); // Lấy nội dung của item đang active
    //    //console.log('Active Item: ' + activeItemText.itemClass()); // Hiển thị item active
    //    alert(currentSlide);
    //});

    $(".notification").on('click', function(event) {
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
                    'border-radius': '10px'
                })
                .css({
                    'padding': setPadding
                })
                .css({
                    'width': setWidth
                })
                .css({
                    'position': 'absolute',
                    'top': 100,
                    'right': 'calc((100% - 1200px) / 2)'
                })
                .modal({
                    showClose: false
                });
        });
    });
    $(document).ready(function() {
        checkTotalCart();

        //Chỉ tải video khi chuẩn bị đc xem
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const element = entry.target; // Phần tử DOM đầy đủ
                const boundingRect = element.getBoundingClientRect();

                // Kiểm tra nếu phần tử cách viewport trong khoảng 900px
                if (
                    boundingRect.top < window.innerHeight + 900 &&
                    boundingRect.bottom > -900
                ) {
                    //Ẩn img thumb
                    const iElements = entry.target.querySelectorAll('i');
                    const imgElements = entry.target.querySelectorAll('img');
                    const videoElements = entry.target.querySelectorAll('video');

                    var id = $(entry.target).attr("data-id");
                    if ($(imgElements).css("display") != "none") {
                        var src = $(videoElements).attr("data-src");
                        $(entry.target).removeClass("auto-play-video");
                        $(iElements).css("display", "none");
                        $(videoElements).css("display", "block");
                        $(imgElements).css("display", "none");
                        PlayVideo(id, src);
                    }

                }
            });
        }, {
            threshold: [0] // 0 nghĩa là chỉ cần một phần của phần tử vào viewport
        });

        // Lặp qua từng phần tử và thêm vào observer
        $('.auto-play-video').each(function() {
            observer.observe(this);
        });

        updateListHeightClass('.pj16-item', 'height-max-550px', 'height-min-550px');
    });
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

function loadMore(totalPage) {
    if (currrentPage < totalPage) {
        loading = true;
        var url = "/Ajax/Loadmore?page=" + (currrentPage + 1);
        $.get(url, function(html) {
            currrentPage++;
            $("#pageHolder").append(html);
            $("#page-pager").hide();
            initVideoPreview();
            loading = false;
        })
    }
}
var myTimer;

function timer(obj, nowTime, endTime) {
    var countDownDate = new Date(endTime).getTime();
    var now = new Date(nowTime).getTime();
    var distance = (countDownDate - now) / 1000;

    var x = setInterval(function() {
        distance--;

        totalSeconds = distance;

        var hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        var minutes = Math.floor(totalSeconds / 60);
        var seconds = totalSeconds % 60;

        var strH = hours > 9 ? hours : '0' + hours;
        var strM = minutes > 9 ? minutes : '0' + minutes;
        var strS = seconds > 9 ? seconds : '0' + seconds;
        var strT = strH + ':' + strM + ':' + strS;

        var html = '';
        for (let i = 0; i < strT.split('').length; i++) {
            if (strT[i] == ':') {
                html += '<span> ' + strT[i] + ' </span>';
            } else {
                html += '<strong> ' + strT[i] + ' </strong>';
            }
        }


        document.getElementById(obj).innerHTML = html;

        if (distance < 0) {
            clearInterval(x);
            document.getElementById(obj).innerHTML = '';
        }
    }, 1000);
}

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

        debugger
        var disableClick = $('.btnQuickOrder').hasClass("disabled") || $('.btnQuickOrder').hasClass("btn-outstock");
        if (disableClick)
            return;

        var sku = $(this).attr('data-sku');
        var colorId = $('#colorOptions .selected').attr('data-id');
        var urlFormOrder = '/ajax/quickorder?skuId=' + sku;
        if (colorId)
            urlFormOrder = '/ajax/quickorder?skuId=' + sku + '&colorId=' + colorId;

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

        priceHtml += ' <i> | Giá đã bao gồm 10% VAT</i>';
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
            var eventValue = normalPrice - eventPrice;
            eventValue = eventValue - extraDiscountPrice;
            $('.eventValue').html(eventValue.toLocaleString('en-US') + ' ₫');
        }
    });


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

function checkTotalCart() {
    var totalItem = 0;
    var inCarts = cartGetCookie();
    if (inCarts && inCarts.length > 0) {
        totalItem = inCarts.reduce(function(a, b) {
            return a + b.number;
        }, 0);;
    }
    $('#cart-total').text(totalItem);

}

function cartGetCookie() {
    var inCarts = [];
    var cookieCart = $.cookie('_cart');
    if (cookieCart && cookieCart != 'null') {
        inCarts = JSON.parse(cookieCart);
    }
    return inCarts;
}


$(function() {
    $('form.login').on('submit', function(e) {
        e.preventDefault();

        var formData = $(this).serializeObject();
        console.log(formData);
        $('.datahere').html(formData);
    });
});

$('.button-more').click(function() {
    $(this).toggleClass('actived');
    $(".hideTrademark").toggleClass('hide', !$(this).hasClass("actived"));
});

function updateListHeightClass(className, classMaxHeight, classMinHeight) {
    var elements = $(className);

    if (elements.length === 0) {
        console.warn("Không tìm thấy phần tử với class:", className);
        return;
    }

    elements.each(function() {
        var elementHeight = $(this).outerHeight();
        $(this).removeClass(classMaxHeight + ' ' + classMinHeight);

        if (elementHeight >= 460 && elementHeight <= 550) {
            $(this).addClass(classMaxHeight);
        } else if (elementHeight > 550) {
            $(this).addClass(classMinHeight);
        }

        $(this).addClass('height-' + Math.floor(elementHeight / 10) * 10);
    });
}
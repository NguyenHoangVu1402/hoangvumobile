var RECAPTCHA_API_KEY = "6Lc8ieoiAAAAAOHeth4LTNkrthxFlRLJaduX7OYM";
var isInCheckDelivery; //Biến này sử dụng mà không rõ khai báo ở đâu
///Đăng ký nhận logs shinhan
$(document).ready(function() {

    const params = new URLSearchParams(window.location.search);
    var refId = params.get('referralId');
    if (refId) {
        var dataTrack = {
            referralId: refId,
            submitDate: params.get('submitDate'),
            customername: params.get('customername'),
            phonenumber: params.get('phonenumber'),
            urlReq: window.location.path
        };
        $.post('/api/shinhan/track', dataTrack);
    }

});

function detailAddon(addOnId) {
    var objChecked = $('[data-id=addon_' + addOnId + ']');
    var isChecked = $(objChecked).prop('checked');

    if (isChecked) {
        $(objChecked).prop("checked", false);
    } else {
        $(objChecked).prop("checked", true);
    }
}

function quickAddOnEdit(skuId, addOnId) {
    //Check ischecked => removed
    var objChecked = $('[data-id=addon_' + skuId + '_' + addOnId + ']');
    var isChecked = $(objChecked).attr('checked');

    if (isChecked) {
        $(objChecked).prop("checked", false);
    } else {
        $(objChecked).prop("checked", true);
    }

    var allAddOn = [];
    $(".add-on-item input." + skuId + ":checked").each(function() {
        allAddOn.push(parseInt($(this).val()));
    });
    $('#addOnId').val(allAddOn.join(','));

    //Submit changeform
    var sku = $('#quickform_SKU').val();
    var colorId = $('#quickform_COLOR').val();
    colorId = (colorId) ? colorId : 0;
    var urlRequestChange = '/ajax/quickorder?skuId=' + sku + '&colorId=' + colorId;
    postValue = $('#quickForm').serializeObject();

    $.post(urlRequestChange, postValue, function(html) {
        $('#popup-modal').html(html);
    });
}


//Các function dùng thêm để thêm, bớt các gói bảo hành
function addOnEdit(skuId, addOnId) {

    //Check ischecked => removed
    var objChecked = $('[data-id=addon_' + skuId + '_' + addOnId + ']');
    var isChecked = $(objChecked).attr('checked');

    if (isChecked) {
        $(objChecked).prop("checked", false);
    } else {
        $(objChecked).prop("checked", true);
    }

    var inCarts = cartGetCookie();
    var idx = inCarts.findIndex(obj => obj.sku == skuId);
    if (idx >= 0) {

        console.log($(".add-on-item input." + skuId + ":checked"));

        var allAddOn = [];
        $(".add-on-item input." + skuId + ":checked").each(function() {
            allAddOn.push(parseInt($(this).val()));
        });

        inCarts[idx].addOn = allAddOn;
        $.cookie('_cart', JSON.stringify(inCarts), {
            path: "/"
        });
    }
    cartReload();
}



function applyVoucher() {
    var postValue = $('#quickForm').serializeObject();
    $.post('/Ajax/Applyvoucher', postValue, function(html) {
        if (html.Errors) {
            $.toast({
                heading: 'Có lỗi xảy ra.',
                text: html.Message,
                showHideTransition: 'fade',
                icon: 'error',
                hideAfter: 10000
            });
        } else {
            $('#voucher').html(html.Message);
        }
    });
    return false;
}

function removeVoucher() {
    $('#voucher').html('');
    $('#PromoteCode').val('');
}



//Xóa từ khóa
function removeKwd(kwd, idx) {
    var kwds = kwdGetCookie();
    kwds.removeByValue(kwd);
    $.cookie('_searchHistory', JSON.stringify(kwds), {
        path: "/"
    });
    $('.search-history ul li:eq(' + idx + ')').remove();
}

//Clear kwd
function clearSearchHistory() {
    $.cookie('_searchHistory', [], {
        path: "/"
    });
    $('.search-history ul').html('');
}


function kwdGetCookie() {
    var kwds = [];
    var cookiekwd = $.cookie('_searchHistory');
    if (cookiekwd && cookiekwd != 'null') {
        kwds = JSON.parse(cookiekwd);
    }
    return kwds;
}

Array.prototype.removeByValue = function(val) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] === val) {
            this.splice(i, 1);
            i--;
        }
    }
    return this;
}


function openTOS() {
    var content = $('#pay-tos').html();
    $("#popup-modal").html(content).modal({
        closeClass: 'icon-minutes',
        closeText: ' '
    });
}

function openKredivo() {
    var content = $('#kredivo-guide').html();
    $("#popup-modal").html(content).modal({
        closeClass: 'icon-minutes',
        closeText: ' '
    });
}

function refreshImgCapcha() {
    var id = randomString(10);
    $("#ImgCapcha").attr('src', '/Captcha.ashx?s=' + id);
}

function randomString(len, charSet) {
    charSet = charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var randomString = '';
    for (var i = 0; i < len; i++) {
        var randomPoz = Math.floor(Math.random() * charSet.length);
        randomString += charSet.substring(randomPoz, randomPoz + 1);
    }
    return randomString;
}

$(document).ready(function() {

    $('.ticker').easyTicker({
        direction: 'up',
        visible: 1,
        interval: 5000
    });

    //Fix height
    $(".equaHeight").each(function(idx, obj) {
        var selector = $(this).attr("data-obj");
        if (selector != '' && selector != undefined) {

            var maxHeight = Math.max.apply(null, $(obj).find(selector).map(function() {
                return $(this).height();
            }).get());
            $(obj).find(selector).height(maxHeight);
            //console.log(maxHeight);
        } else {
            $(obj).children().ready(function() {

                setTimeout(function() {
                    var maxHeight = Math.max.apply(null, $(obj).children().map(function() {
                        return $(this).height();
                    }).get());
                    $(obj).children().height(maxHeight);
                }, 450);
            });
        }
    });

    $('a#top').click(function() {
        $('html, body').animate({
            scrollTop: 0
        }, 500);
    });

    //Build options
    $('.options .item span label').each(function(idx, el) {
        var parentWidth = $(this).width();

        var html_calc = $('<span>' + $(this).text() + '</span>');
        html_calc.css('font-size', $(this).css('font-size')).hide();
        html_calc.prependTo('body');
        var childWidth = html_calc.width();
        html_calc.remove();
        if (childWidth >= parentWidth) {
            $(this).addClass('yoyo');
        }
    });


    $('.timer').each(function(idx, el) {
        var dataId = $(this).attr('id');
        var dataStart = $(this).attr('data-start');
        var dataEnd = $(this).attr('data-end');
        timer(dataId, dataStart, dataEnd);
    });

});

function fixHeight() {

    $(".equaHeight").each(function(idx, obj) {
        var selector = $(this).attr("data-obj");
        if (selector != '' && selector != undefined) {

            var maxHeight = Math.max.apply(null, $(obj).find(selector).map(function() {
                return $(this).height();
            }).get());
            $(obj).find(selector).height(maxHeight);
            //console.log(maxHeight);
        } else {
            $(obj).children().ready(function() {

                setTimeout(function() {
                    var maxHeight = Math.max.apply(null, $(obj).children().map(function() {
                        return $(this).height();
                    }).get());
                    $(obj).children().height(maxHeight);
                }, 450);
            });
        }
    });
}

function HideReview(id, container) {
    if (confirm("Bạn có muốn ẩn đánh giá này!")) {

        $.post('/api/review/hide', {
            "id": id
        }, function(xhrdata) {
            if (xhrdata.Errors) {
                $.toast({
                    heading: 'Có lỗi xảy ra.',
                    text: xhrdata.Title,
                    showHideTransition: 'fade',
                    icon: 'error',
                    hideAfter: 15000
                });
            } else {
                $.toast({
                    heading: xhrdata.Title,
                    showHideTransition: 'fade',
                    icon: 'success',
                    hideAfter: 5000
                });

                var req = $(container).parent().find('input[name=commentReq]').val();
                var dataReq = JSON.parse(req);
                dataReq.isMaster = true;
                //console.log(dataReq);

                $.post(dataReq.path, dataReq, function(data) {
                    $(container).parent().html(data);
                });
            }
        });
    }
}



function RemoveReview(id, container) {
    if (confirm("Bạn có muốn xóa đánh giá này!")) {

        $.post('/api/review/remove', {
            "id": id
        }, function(xhrdata) {
            if (xhrdata.Errors) {
                $.toast({
                    heading: 'Có lỗi xảy ra.',
                    text: xhrdata.Title,
                    showHideTransition: 'fade',
                    icon: 'error',
                    hideAfter: 15000
                });
            } else {
                $.toast({
                    heading: xhrdata.Title,
                    showHideTransition: 'fade',
                    icon: 'success',
                    hideAfter: 5000
                });

                var req = $(container).parent().find('input[name=commentReq]').val();
                var dataReq = JSON.parse(req);
                //console.log(dataReq);

                $.post(dataReq.path, dataReq, function(data) {
                    $(container).parent().html(data);
                });
            }
        });
    }
}


function HideComment(id, container) {
    if (confirm("Bạn có muốn ẩn bình luận này!")) {

        $.post('/api/comment/hide', {
            "id": id
        }, function(xhrdata) {
            if (xhrdata.Errors) {
                $.toast({
                    heading: 'Có lỗi xảy ra.',
                    text: xhrdata.Title,
                    showHideTransition: 'fade',
                    icon: 'error',
                    hideAfter: 15000
                });
            } else {
                $.toast({
                    heading: xhrdata.Title,
                    showHideTransition: 'fade',
                    icon: 'success',
                    hideAfter: 5000
                });

                var req = $(container).parent().find('input[name=commentReq]').val();
                var dataReq = JSON.parse(req);
                dataReq.isMaster = true;
                //console.log(dataReq);

                $.post(dataReq.path, dataReq, function(data) {
                    $(container).parent().html(data);
                });
            }
        });
    }
}



function RemoveComment(id, container) {
    if (confirm("Bạn có muốn xóa bình luận này!")) {

        $.post('/api/comment/remove', {
            "id": id
        }, function(xhrdata) {
            if (xhrdata.Errors) {
                $.toast({
                    heading: 'Có lỗi xảy ra.',
                    text: xhrdata.Title,
                    showHideTransition: 'fade',
                    icon: 'error',
                    hideAfter: 15000
                });
            } else {
                $.toast({
                    heading: xhrdata.Title,
                    showHideTransition: 'fade',
                    icon: 'success',
                    hideAfter: 5000
                });

                var req = $(container).parent().find('input[name=commentReq]').val();
                var dataReq = JSON.parse(req);
                dataReq.isMaster = true;
                //console.log(dataReq);

                $.post(dataReq.path, dataReq, function(data) {
                    $(container).parent().html(data);
                });
            }
        });
    }
}

function showFLS(flsId) {
    $('section.fls').hide();
    $('section#' + flsId).show();
}


function productDetails() {

    var cookieCity = $.cookie('_city');
    if (cookieCity) {
        var selector = '#city_' + cookieCity;
        if ($(selector).length) {
            marketFilters(cookieCity);
        }
    }
}

function UserLocation(city) {
    //alert(city);
    $.cookie('_city', city, {
        path: "/"
    });
}

window.onscroll = function() {
    scrollTopFunction()
};

function scrollTopFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        $('#backtoTop').show();
    } else {
        $('#backtoTop').hide();
    }
}


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


//hiển thị review
function init_Review() {
    //var review form
    var form = $('#reviewForm');
    var postValue = $(form).serializeObject();

    //Load review content
    ajaxLoadReview(postValue.ModelID, postValue.SystemTypeID, 1, $('#reviews .review-content'), false);


    var options = {
        max_value: 5,
        step_size: 0.5,
        selected_symbol_type: 'hhicon',
        cursor: 'default',
        readonly: false,
        change_once: false
    };

    $(".rating").rate(options);
    $(".rating").on("change", function(ev, data) {

        var msg = validateForm(form);
        if (msg == '') {
            $(form).find('input[name=Rate]').val(data.to); //set value input
            postValue = $(form).serializeObject(); //Get new val

            $.post('/api/review', postValue, function(xhrdata) {
                if (xhrdata.Errors) {
                    $.toast({
                        heading: 'Có lỗi khi gửi review.',
                        text: xhrdata.Message,
                        showHideTransition: 'fade',
                        icon: 'error',
                        hideAfter: 15000
                    });
                } else {
                    $.toast({
                        heading: xhrdata.Title,
                        showHideTransition: 'fade',
                        icon: 'success',
                        hideAfter: 15000
                    });
                    $(form).find('textarea').val('');
                    ajaxLoadReview(postValue.ModelID, postValue.SystemTypeID, 1, $('#reviewContent'), true);
                }
            });
        } else {
            $.toast({
                heading: 'Bạn cần kiểm tra lại thông tin.',
                text: msg,
                showHideTransition: 'fade',
                icon: 'error',
                hideAfter: 15000
            });
        }
    });
}


//hiển thị review
function init_Comment() {
    var form = $('#comments form');
    var postValue = $(form).serializeObject();
    ajaxLoadComment(postValue.ModelID, postValue.SystemTypeID, 1, $('#commentContent'), 0, true, false);
}

//load review content
function ajaxLoadReview(modelId, TypeId, p, appendTo, ismaster) {

    var req = {
        path: '/ajax/review',
        modelId: modelId,
        systemTypeId: TypeId,
        ismaster: ismaster,
        p: 1
    }

    $.post(req.path, req, function(data) {
        $(appendTo).html(data);
    });
}

//load comment content
function ajaxLoadComment(modelId, TypeId, p, appendTo, parentId, includeChild, ismaster) {

    var req = {
        path: '/ajax/comment',
        modelId: modelId,
        systemTypeId: TypeId,
        parent: parentId,
        child: includeChild,
        ismaster: ismaster,
        p: 1
    }

    $.post(req.path, req, function(data) {
        $(appendTo).html(data);
    });
}

function displayRate(obj) {
    $(obj).rate({
        max_value: 5,
        step_size: 0.5,
        selected_symbol_type: 'hhicon',
        cursor: 'default',
        readonly: true
    });
}



function init_cityChange(dfDistrictId) {
    $('#SystemCityID').change(function() {
        var cityID = $(this).val();
        var districtID = dfDistrictId;
        var districtReq = '/Ajax/District?CityID=' + cityID + '&DistrictID=' + districtID;
        $.get(districtReq, function(htmlselect) {
            $('#SystemDistrictID').html(htmlselect);
        });
    });

    var cookieCity = $.cookie('_city');
    if (cookieCity) {
        $('#SystemCityID').val(cookieCity);
    }

    $('#SystemCityID').change();
}

function init_cityMarketChange(dfMarketId) {

    $('#MKSystemCityID').change(function() {
        var cityID = $(this).val();
        var marketId = dfMarketId;
        var quickOrder_productId = $('#quickOrder_productId').val();
        var quickOrder_SKU = $('#quickOrder_SKU').val();

        var districtReq = '/Ajax/Market?CityID=' + cityID + '&MarketID=' + marketId;
        if (quickOrder_productId && quickOrder_SKU)
            districtReq = '/Ajax/Market?CityID=' + cityID + '&MarketID=' + marketId + '&ProductID=' + quickOrder_productId + '&SKU=' + quickOrder_SKU;
        $.get(districtReq, function(htmlselect) {
            $('#SystemMarketID').html(htmlselect);
        });
    });

    var cookieCity = $.cookie('_city');
    if (cookieCity) {
        $('#MKSystemCityID').val(cookieCity);
    }

    $('#MKSystemCityID').change();
}



function validatePhone(phoneNumer) {
    var vnf_regex = /((09|03|07|08|05)+([0-9]{8})\b)/g;
    return vnf_regex.test(phoneNumer);
}

function validateEmail(emailField) {
    var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    if (reg.test(emailField) == false) {
        return false;
    }
    return true;

}


function updateViewProduct(productId) {
    $.post('/api/product/updateview/' + productId);
}

function updateViewRepair(productId) {
    $.post('/api/repair/updateview/' + productId);
}


function validateForm(form) {
    var postValue = $(form).serializeObject();
    var msg = '';
    for (var field in postValue) {

        var fieldErrors = '';

        var value = postValue[field];
        var isHasContent = value != '';
        var placeHolder = $(form).find(' *[name=' + field + ']').attr('placeholder');
        var title = $(form).find(' *[name=' + field + ']').attr('title');
        var isRequired = $(form).find('*[name=' + field + ']').attr('data-required');
        var isMinLength = $(form).find('*[name=' + field + ']').attr('data-minlength');
        var isPhone = $(form).find('*[name=' + field + ']').attr('type') == 'tel';
        var isEmail = $(form).find('*[name=' + field + ']').attr('type') == 'email';
        var isNumber = $(form).find('*[name=' + field + ']').attr('type') == 'number';

        title = title ? title : placeHolder;
        title = title ? title : field;

        if (isRequired && value == '')
            fieldErrors += 'Bạn cần nhập ' + title + '<br />';
        else if (isPhone && isHasContent && !validatePhone(value))
            fieldErrors += title + ' không đúng định dạng<br />';
        else if (isEmail && isHasContent && !validateEmail(value))
            fieldErrors += title + ' không đúng định dạng<br />';
        else if (isMinLength != '' && parseInt(isMinLength) > 0 && parseInt(isMinLength) > value.length && value != '')
            fieldErrors += title + ' Cần nhập tối thiêu ' + isMinLength + ' ký tự<br />';
        if (fieldErrors != '') {
            $(form).find('*[name=' + field + ']').addClass('errors');
            $(form).find('*[name=' + field + ']').parent().addClass('errors');
        } else {
            $(form).find('*[name=' + field + ']').parent().removeClass('errors');
        }

        msg += fieldErrors;
    }

    return msg;
}


function submitSearch(form) {
    var kwd = $(form).find("#kwd").val();
    if (kwd == '') {
        $.toast({
            heading: 'Chú ý.!',
            text: 'Vui lòng nhập từ khóa tìm kiếm.',
            icon: 'error'
        });
        return false;
    }
}

function submitSubscription(form) {
    var email = $(form).find("#email").val();
    if (validateEmail(email)) {
        $.post("/Ajax/AddSubScription", $(form).serialize(), function(data) {
            if (data.Errors) {
                $.toast({
                    heading: 'Lỗi',
                    text: data.Message,
                    icon: 'error'
                });
            } else {
                $.toast({
                    heading: 'Đăng ký thành công.!',
                    text: data.Message,
                    icon: 'success'
                });
                $(form).find("#email").val("")
            }
        });
    } else {
        $.toast({
            heading: 'Lỗi',
            text: 'Email không hợp lệ, vui lòng kiểm tra lại.',
            icon: 'error'
        });
    }
    return false;
}

//Tạo complete cho so sánh sản phẩm
function compareAutocomplete(format) {

    $('#kwdCompare').autocomplete({
        serviceUrl: '/api/search?template=' + format.template + '&ptype=' + format.ptype + '&ignore=' + format.ignore,
        deferRequestBy: 200,
        maxHeight: 350,
        formatResult: autoComplateFormat
    });
}


//AutoComplete format
function autoComplateFormat(suggestion, currentValue) {

    //var htmlHint = '<p>Hiển thị kết quả cho <strong><i>' + currentValue + '</i></strong></p>';
    //$(".autocomplete-suggestions").append(htmlHint);

    var html = '<div class="search-item" onclick="location.href=\'' + suggestion.data.uid + '\'">';
    html += '<div class="img"><img src="' + suggestion.data.image + '" /></a></div>';
    html += '   <div class="info">';
    html += '       <h2><a href="' + suggestion.data.uid + '">' + suggestion.data.title + '</a></h2>';
    html += '       <h3><strike>' + suggestion.data.lastprice + '</strike> ' + suggestion.data.price + '</h3>';
    html += '   </div>';
    html += '</div>';
    html += '</div>';
    return html;
}


function init_installmentOrder() {

}


function validFormInstallment(orderForm) {
    var form = $(orderForm);
    var msg = validateForm(form);

    var isLock = $('#installmentForm button[type=submit]').attr('disabled');
    if (msg == '' && !isLock) {


        postValue = $(form).serializeObject(); //Get new val

        //Lock button
        $('#installmentForm button[type=submit]').text('ĐANG GỬI THÔNG TIN...').attr('disabled', 'disabled');

        $.post('/api/cart/installmentOrder', postValue, function(xhrdata) {
            if (xhrdata.Errors) {
                $.toast({
                    heading: 'Có lỗi khi gửi thông tin đơn hàng.',
                    text: xhrdata.Message,
                    showHideTransition: 'fade',
                    icon: 'error',
                    hideAfter: 10000
                });
            } else {
                $.toast({
                    heading: 'Đăng ký thành công',
                    text: xhrdata.Message,
                    showHideTransition: 'fade',
                    icon: 'success',
                    position: 'bottom-center',
                    hideAfter: 10000
                });

                var htmlContent = '<p style="text-align:center; font-size:20px;">Cám ơn bạn đã gửi yêu cầu đăng ký mua trả góp. Mã đơn hàng đăng ký trả góp của bạn là <a href="/order/installment/' + xhrdata.Title + '"><strong>' + xhrdata.Title + '</strong></a></p>';

                $('#form-container').html(htmlContent);

            }

            //unlock
            $('#installmentForm button[type=submit]').text('TIẾN HÀNH ĐẶT HÀNG').removeAttr('disabled');
        });
    } else {
        $.toast({
            heading: 'Bạn cần kiểm tra lại thông tin.',
            text: msg,
            showHideTransition: 'fade',
            icon: 'error',
            hideAfter: 10000
        });
    }


    return false;
}

function init_quickSub() {
    $(".quick-order-form .options .option a").click(function() {

        var colorId = $(this).attr('data-id');
        colorId = (colorId) ? colorId : 0;
        $('#colorId').val(colorId);


        $("a.selectedOption").find('i.icon-checked').addClass('icon-border').removeClass('icon-checked');
        $("a.selectedOption").addClass('changeOption').removeClass('selectedOption');

        $(this).addClass('selectedOption').removeClass('changeOption');
        $(this).find('i.icon-border').addClass('icon-checked').removeClass('icon-border');

    });


    var maxWidth = Math.max.apply(null, $(".options .option a").map(function() {
        return $(this).width();
    }).get());
    $(".options .option a").width(maxWidth);
}



function init_quickOrder() {

    $("a.changeOption").click(function() {
        var sku = $(this).attr('data-sku');
        var colorId = $(this).attr('data-id');
        colorId = (colorId) ? colorId : 0;
        var urlRequestChange = '/ajax/quickorder?skuId=' + sku + '&colorId=' + colorId;
        postValue = $('#quickForm').serializeObject();

        $.post(urlRequestChange, postValue, function(html) {
            $('#popup-modal').html(html);
        });
    });

    $("input.cart-promote:not(:checked)").click(function() {
        var allOfferId = [];
        $('input.cart-promote:checked').each(function() {
            allOfferId.push($(this).val());
        });
        var offerId = allOfferId.join(',');
        var sku = $('#quickForm input[name=SKU]').val();
        var colorId = $('#quickForm input[name=COLOR]').val();
        var urlRequestChange = '/ajax/quickorder?skuId=' + sku + '&colorId=' + colorId + '&offerId=' + offerId;
        postValue = $('#quickForm').serializeObject();
        $.post(urlRequestChange, postValue, function(html) {
            $('#popup-modal').html(html);
        });
    });


    $(".control #btnMinutes").click(function() {
        var number = $(".control #Number").val();
        number = number > 1 ? number - 1 : number;
        $(".control #Number").val(number);

        var priceUpdate = $('#quickOrderPrice').attr('data-value');
        var newVal = priceUpdate * number;
        $('#quickOrderPrice').text(new Intl.NumberFormat().format(newVal));

        priceUpdate = $('#quickOrderPriceLast').attr('data-value');
        newVal = priceUpdate * number;
        $('#quickOrderPriceLast').text(new Intl.NumberFormat().format(newVal));
        return false;
    });


    $(".control #btnPlus").click(function() {
        var number = $(".control #Number").val();
        number++;
        $(".control #Number").val(number);

        var priceUpdate = $('#quickOrderPrice').attr('data-value');
        var newVal = priceUpdate * number;
        $('#quickOrderPrice').text(new Intl.NumberFormat().format(newVal));

        priceUpdate = $('#quickOrderPriceLast').attr('data-value');
        newVal = priceUpdate * number;
        $('#quickOrderPriceLast').text(new Intl.NumberFormat().format(newVal));
        return false;
    });


    $(".cart-paymentTypeId").click(function() {
        var payType = $(this).val();

        $('.payment-opt').removeClass('payment-selected');
        if (payType == 1) {
            $('#payType_1').addClass('payment-selected');
            $('#f_payType_1').show();
            $('#f_payType_5').hide();

            $('#SystemCityID, #SystemDistrictID, #Address').attr('data-required', 1);
            $('#SystemMarketID').removeAttr('data-required');

        } else {
            $('#payType_5').addClass('payment-selected');
            $('#f_payType_5').show();
            $('#f_payType_1').hide();


            $('#SystemMarketID').attr('data-required', 1);
            $('#SystemCityID, #SystemDistrictID, #Address').removeAttr('data-required');
        }


        $('#SystemCityID').change();
        $('#MKSystemCityID').change();

    });

    $('.cart-paymentTypeId:checked').click();


    var maxWidth = Math.max.apply(null, $(".options .option a").map(function() {
        return $(this).width();
    }).get());
    $(".options .option a").width(maxWidth);

}



function wishProduct(productId, isAuthenticate) {

    var html = '<div class="cart-msg">';

    if (isAuthenticate) {
        $.post('/api/account/wish', {
            ID: productId
        }, function(data) {
            if (!data.Errors) {
                $('.love-this-button a').toggleClass('inlist');
            }
            html += '<p><i class="icon-checked text-red"></i> <span>' + data.Title + '</span></p>';
            html += '<a class="button button-red" href="/account/wishlist">Quản lý danh sách</a>';
            html += '</div>';
            $.toast({
                text: html,
                position: 'bottom-center',
                stack: false,
                loader: false,
                hideAfter: 5000
            });
        });
    } else {
        html += '<p><i class="icon-minutes text-red"></i> <span>Bạn cần đăng nhập để sử dụng chức năng này</span></p>';
        html += '<a class="button button-red" href="/account/login">Đăng nhập/Đăng ký</a>';
        html += '</div>';
        $.toast({
            text: html,
            position: 'bottom-center',
            stack: false,
            loader: false,
            hideAfter: 5000
        });
    }

}

function viewImage360(image) {
    $.toast({
        text: 'IMG360',
        position: 'bottom-center',
        stack: false,
        loader: false,
        hideAfter: 5000
    });
}

function checkWarranty(checkForm) {
    var form = $(checkForm);
    var msg = validateForm(form);
    var container = $(checkForm).parent().find('.warranty-info');

    if (msg == '') {
        postValue = $(form).serializeObject(); //Get new val
        $.post('/api/warranty', postValue, function(xhrdata) {

            if (xhrdata.type) {
                location.href = xhrdata.url;
            } else if (xhrdata.ok) {
                $.toast({
                    text: 'Tìm thấy thông tin bảo hành.',
                    showHideTransition: 'fade',
                    hideAfter: 5000
                });
                $('.container .title').text(xhrdata.title);
                $('.container .imei').text(xhrdata.imei);
                $('.container .buyDate').text(xhrdata.buyDate);
                $('.container .expiryDate').text(xhrdata.expiryDate);
                $('.container .store').text(xhrdata.store);

                $('.container .found').show();
                $('.container .not-found').hide();
            } else {
                $.toast({
                    text: 'Không tìm thấy thông tin bảo hành.',
                    showHideTransition: 'fade',
                    hideAfter: 5000
                });
                $('.container .imei').text(postValue.IMEI);
                $('.container .found').hide();
                $('.container .not-found').show();
            }
        });
    } else {
        $.toast({
            heading: 'Bạn cần nhập mã IEMI của sản phẩm.',
            text: msg,
            showHideTransition: 'fade',
            icon: 'error',
            hideAfter: 5000
        });
    }
    return false;
}

function validFormCheckOrder(checkForm) {
    var form = $(checkForm);
    var msg = validateForm(form);

    if (msg == '') {
        postValue = $(form).serializeObject(); //Get new val
        $.post('/api/order/check', postValue, function(xhrdata) {
            if (xhrdata.Errors) {
                $.toast({
                    text: xhrdata.Title,
                    showHideTransition: 'fade',
                    icon: 'error',
                    hideAfter: 15000
                });
            } else {
                $.toast({
                    text: xhrdata.Title,
                    showHideTransition: 'fade',
                    icon: 'success',
                    hideAfter: 5000
                });
                setTimeout(function() {
                    location.href = xhrdata.Message;
                }, 500);
            }
        });
    } else {
        $.toast({
            heading: 'Bạn cần nhập mã đơn hàng.',
            text: msg,
            showHideTransition: 'fade',
            icon: 'error',
            hideAfter: 15000
        });
    }
    return false;
}


///Valid và gửi thông tin đăng ký nhận thông tin
function validFormQuickSub(orderForm) {
    var form = $(orderForm);
    var msg = validateForm(form);

    if (msg == '') {
        postValue = $(form).serializeObject(); //Get new val
        $.post('/api/cart/quicksub', postValue, function(xhrdata) {
            if (xhrdata.Errors) {
                $.toast({
                    heading: 'Có lỗi khi gửi thông tin đăng ký.',
                    text: xhrdata.Message,
                    showHideTransition: 'fade',
                    icon: 'error',
                    hideAfter: 10000
                });
            } else {
                $.toast({
                    heading: xhrdata.Title,
                    text: xhrdata.Message,
                    showHideTransition: 'fade',
                    icon: 'success',
                    position: 'bottom-center',
                    hideAfter: 10000
                });
                $('#popup-modal a.close-modal').click();
            }
        });
    } else {
        $.toast({
            heading: 'Bạn cần kiểm tra lại thông tin.',
            text: msg,
            showHideTransition: 'fade',
            icon: 'error',
            hideAfter: 10000
        });
    }

    return false;
}



///Valid và gửi thông tin đăng ký nhận thông tin trôi bảo hành
function validFormQuickTBH(orderForm) {
    var form = $(orderForm);
    var msg = validateForm(form);

    if (msg == '') {
        postValue = $(form).serializeObject(); //Get new val
        $.post('/api/cart/quickTBH', postValue, function(xhrdata) {
            if (xhrdata.Errors) {
                $.toast({
                    heading: 'Có lỗi khi gửi thông tin đăng ký.',
                    text: xhrdata.Message,
                    showHideTransition: 'fade',
                    icon: 'error',
                    hideAfter: 10000
                });
            } else {
                $.toast({
                    heading: xhrdata.Title,
                    text: xhrdata.Message,
                    showHideTransition: 'fade',
                    icon: 'success',
                    position: 'bottom-center',
                    hideAfter: 10000
                });
                $('#popup-modal a.close-modal').click();
            }
        });
    } else {
        $.toast({
            heading: 'Bạn cần kiểm tra lại thông tin.',
            text: msg,
            showHideTransition: 'fade',
            icon: 'error',
            hideAfter: 10000
        });
    }

    return false;
}




function validFormQuickOrder(orderForm) {
    var form = $(orderForm);
    var msg = validateForm(form);


    var isLock = $('#quickForm button[type=submit]').attr('disabled');
    if (msg == '' && !isLock) {

        //MapPromoteion
        var allOfferId = [];
        $('#quickFormPromote').find(':checked').each(function() {
            allOfferId.push($(this).val());
        });
        $('#quickForm #Promote').val(allOfferId.join(','));


        //Lock button
        $('#quickForm button[type=submit]').text('ĐANG GỬI THÔNG TIN...').attr('disabled', 'disabled');



        var postValue = $(form).serializeObject(); //Get new val
        $.post('/api/cart/quickorder', postValue, function(xhrdata) {
            if (xhrdata.Errors) {
                $.toast({
                    heading: 'Có lỗi khi gửi thông tin đơn hàng.',
                    text: xhrdata.Message,
                    showHideTransition: 'fade',
                    icon: 'error',
                    hideAfter: 10000
                });
            } else {
                $.toast({
                    heading: xhrdata.Title,
                    text: xhrdata.Message,
                    showHideTransition: 'fade',
                    icon: 'success',
                    position: 'bottom-center',
                    hideAfter: 10000
                });
                $('#popup-modal a.close-modal').click();

                setTimeout(function() {
                    location.href = xhrdata.Link + '?success=1';
                }, 100);
            }

            //unlock
            $('#quickForm button[type=submit]').text('TIẾN HÀNH ĐẶT HÀNG').removeAttr('disabled');
        });
        //post
    } else {
        $.toast({
            heading: 'Bạn cần kiểm tra lại thông tin.',
            text: msg,
            showHideTransition: 'fade',
            icon: 'error',
            hideAfter: 10000
        });
    }
    return false;
}



function validFormQuickOrder_v2(orderForm) {
    var form = $(orderForm);
    var msg = validateForm(form);



    //Check Captcha
    var capthCharIscheck = $('.g-recaptcha-response').val();

    if (capthCharIscheck == null || capthCharIscheck == '') {
        msg += 'Bạn cần tích chọn xác thực không phải người máy.';
        $('#g_captcha_container').css('border', '1px solid red');
    } else {
        $('#g_captcha_container').css('border', 'none');
    }

    var isLock = $('#quickForm button[type=submit]').attr('disabled');
    if (msg == '' && !isLock) {

        //MapPromoteion
        var allOfferId = [];
        $('#quickFormPromote').find(':checked').each(function() {
            allOfferId.push($(this).val());
        });
        $('#quickForm #Promote').val(allOfferId.join(','));


        //Lock button
        $('#quickForm button[type=submit]').text('ĐANG GỬI THÔNG TIN...').attr('disabled', 'disabled');



        var postValue = $(form).serializeObject(); //Get new val
        $.post('/api/cart/quickorder', postValue, function(xhrdata) {
            if (xhrdata.Errors) {
                $.toast({
                    heading: 'Có lỗi khi gửi thông tin đơn hàng.',
                    text: xhrdata.Message,
                    showHideTransition: 'fade',
                    icon: 'error',
                    hideAfter: 10000
                });
            } else {
                $.toast({
                    heading: xhrdata.Title,
                    text: xhrdata.Message,
                    showHideTransition: 'fade',
                    icon: 'success',
                    position: 'bottom-center',
                    hideAfter: 10000
                });
                $('#popup-modal a.close-modal').click();

                setTimeout(function() {
                    location.href = xhrdata.Link + '?success=1';
                }, 1000);
            }

            //unlock
            $('#quickForm button[type=submit]').text('TIẾN HÀNH ĐẶT HÀNG').removeAttr('disabled');
        });
        //post
    } else {
        $.toast({
            heading: 'Bạn cần kiểm tra lại thông tin.',
            text: msg,
            showHideTransition: 'fade',
            icon: 'error',
            hideAfter: 10000
        });
    }
    return false;
}




function validFormQuickOrder_v3(orderForm) {
    var form = $(orderForm);
    var msg = validateForm(form);

    var isLock = $('#quickForm button[type=submit]').attr('disabled');
    if (msg == '' && !isLock) {

        //MapPromoteion
        var allOfferId = [];
        $('#quickFormPromote').find(':checked').each(function() {
            allOfferId.push($(this).val());
        });
        $('#quickForm #Promote').val(allOfferId.join(','));


        grecaptcha.ready(function() {
            grecaptcha.execute(RECAPTCHA_API_KEY, {
                action: 'order'
            }).then(function(token) {
                $('#hdnGoogleRecaptcha').val(token);

                postValue = $(form).serializeObject(); //Get new val

                //Lock button
                $('#quickForm button[type=submit]').text('ĐANG GỬI THÔNG TIN...').attr('disabled', 'disabled');

                $.post('/api/cart/quickorder', postValue, function(xhrdata) {
                    if (xhrdata.Errors) {
                        $.toast({
                            heading: 'Có lỗi khi gửi thông tin đơn hàng.',
                            text: xhrdata.Message,
                            showHideTransition: 'fade',
                            icon: 'error',
                            hideAfter: 10000
                        });
                    } else {
                        $.toast({
                            heading: xhrdata.Title,
                            text: xhrdata.Message,
                            showHideTransition: 'fade',
                            icon: 'success',
                            position: 'bottom-center',
                            hideAfter: 10000
                        });
                        $('#popup-modal a.close-modal').click();

                        setTimeout(function() {
                            location.href = xhrdata.Link + '?success=1';
                        }, 1000);
                    }

                    //unlock
                    $('#quickForm button[type=submit]').text('TIẾN HÀNH ĐẶT HÀNG').removeAttr('disabled');
                });
                //post

            });
        });


    } else {
        $.toast({
            heading: 'Bạn cần kiểm tra lại thông tin.',
            text: msg,
            showHideTransition: 'fade',
            icon: 'error',
            hideAfter: 10000
        });
    }


    return false;
}


function validFormOrder(orderForm) {
    var form = $(orderForm);
    var msg = validateForm(form);
    if (msg == '') {

        //post value
        postValue = $(form).serializeObject(); //Get new val
        $.post('/api/cart/checkout', postValue, function(xhrdata) {
            if (xhrdata.Errors) {
                $.toast({
                    heading: 'Có lỗi khi gửi thông tin đơn hàng.',
                    text: xhrdata.Message,
                    showHideTransition: 'fade',
                    icon: 'error',
                    hideAfter: 15000
                });
            } else {
                $.toast({
                    heading: xhrdata.Title,
                    showHideTransition: 'fade',
                    icon: 'success',
                    hideAfter: 15000
                });
                location.href = '/cart/checkout';
            }
        });
        //post value

    } else {
        $.toast({
            heading: 'Bạn cần kiểm tra lại thông tin.',
            text: msg,
            showHideTransition: 'fade',
            icon: 'error',
            hideAfter: 15000
        });
    }

    return false;
}


function validFormOrder_v2(orderForm) {
    var form = $(orderForm);
    var msg = validateForm(form);


    //Check Captcha
    var capthCharIscheck = $('.g-recaptcha-response').val();

    if (capthCharIscheck == null || capthCharIscheck == '') {
        msg += 'Bạn cần tích chọn xác thực không phải người máy.';
        $('#g_captcha_container').css('border', '1px solid red');
    } else {
        $('#g_captcha_container').css('border', 'none');
    }

    if (msg == '') {

        //post value
        postValue = $(form).serializeObject(); //Get new val
        $.post('/api/cart/checkout', postValue, function(xhrdata) {
            if (xhrdata.Errors) {
                $.toast({
                    heading: 'Có lỗi khi gửi thông tin đơn hàng.',
                    text: xhrdata.Message,
                    showHideTransition: 'fade',
                    icon: 'error',
                    hideAfter: 15000
                });
            } else {
                $.toast({
                    heading: xhrdata.Title,
                    showHideTransition: 'fade',
                    icon: 'success',
                    hideAfter: 15000
                });
                location.href = '/cart/checkout';
            }
        });
        //post value

    } else {
        $.toast({
            heading: 'Bạn cần kiểm tra lại thông tin.',
            text: msg,
            showHideTransition: 'fade',
            icon: 'error',
            hideAfter: 15000
        });
    }

    return false;
}


//Valid đơn hàng
function validCartOrder(orderForm) {
    var form = $(orderForm);
    var msg = validateForm(form);

    if (msg == '') {
        return true;
    } else {
        $.toast({
            heading: 'Bạn cần kiểm tra lại thông tin.',
            text: msg,
            showHideTransition: 'fade',
            icon: 'error',
            hideAfter: 15000
        });
        return false;
    }
}



///v3 option
function validFormOrder_v3(orderForm) {
    var form = $(orderForm);
    var msg = validateForm(form);

    if (msg == '') {


        grecaptcha.ready(function() {
            grecaptcha.execute(RECAPTCHA_API_KEY, {
                action: 'order'
            }).then(function(token) {
                $('#hdnGoogleRecaptcha').val(token);
                //post value
                postValue = $(form).serializeObject(); //Get new val
                $.post('/api/cart/checkout', postValue, function(xhrdata) {
                    if (xhrdata.Errors) {
                        $.toast({
                            heading: 'Có lỗi khi gửi thông tin đơn hàng.',
                            text: xhrdata.Message,
                            showHideTransition: 'fade',
                            icon: 'error',
                            hideAfter: 15000
                        });
                    } else {
                        $.toast({
                            heading: xhrdata.Title,
                            showHideTransition: 'fade',
                            icon: 'success',
                            hideAfter: 15000
                        });
                        location.href = '/cart/checkout';
                    }
                });

                //post value
            });
        });



    } else {
        $.toast({
            heading: 'Bạn cần kiểm tra lại thông tin.',
            text: msg,
            showHideTransition: 'fade',
            icon: 'error',
            hideAfter: 15000
        });
    }

    return false;
}

function cartGetCookie() {
    var inCarts = [];
    var cookieCart = $.cookie('_cart');
    if (cookieCart && cookieCart != 'null') {
        inCarts = JSON.parse(cookieCart);
    }
    return inCarts;
}

//Đổi quà
function cartChangeOffer(skuId) {
    var inCarts = cartGetCookie();
    var idx = inCarts.findIndex(obj => obj.sku == skuId);
    if (idx >= 0) {
        var allOfferId = [];
        $('#of_' + skuId).find(':checked').each(function() {
            allOfferId.push($(this).val());
        });
        inCarts[idx].offer = allOfferId;
    }
    $.cookie('_cart', JSON.stringify(inCarts), {
        path: "/"
    });
    console.log(inCarts);
    cartReload();
}

function cartMinutes(skuId) {
    var inCarts = cartGetCookie();
    var idx = inCarts.findIndex(obj => obj.sku == skuId);
    if (idx >= 0) {
        if (inCarts[idx].number == 1) {
            cartDelete(skuId);
            return;
        } else
            inCarts[idx].number--;
        $.cookie('_cart', JSON.stringify(inCarts), {
            path: "/"
        });
    }
    cartReload();
}

function cartPlus(skuId) {
    var inCarts = cartGetCookie();
    var idx = inCarts.findIndex(obj => obj.sku == skuId);
    if (idx >= 0) {
        inCarts[idx].number++;
        $.cookie('_cart', JSON.stringify(inCarts), {
            path: "/"
        });
    }
    cartReload();
}

function cartChange(skuId) {

    cartReload();
}

function cartDelete(skuId) {
    var inCarts = cartGetCookie();
    var idx = inCarts.findIndex(obj => obj.sku == skuId);
    if (idx >= 0) {
        inCarts.splice(idx, 1);
        $.cookie('_cart', JSON.stringify(inCarts), {
            path: "/"
        });
    }
    cartReload();
}

function cartEdit(skuId) {

    cartReload();
}

function cartReload() {
    var inCarts = cartGetCookie();
    if (inCarts.length > 0) {

        var urlReload = '/Ajax/CartItems';
        $.get(urlReload, function(data) {
            $('#cartInfo').html(data);
        });
    } else {
        location.href = '/gio-hang';
    }
}

function btnInstallment() {

    $('.btnInstallment').click(function(event) {
        var disableClick = $('.btnInstallment').hasClass("disabled") || $('.btnQuickOrder').hasClass("btn-outstock");
        if (disableClick)
            return false;
    });
}




//Thêm giỏ hàng
function AddCart() {
    $('.add-cart').not('.disabled').not('.btn-outstock').click(function(event) {

        var that = $(this);

        var disableClick = $('.add-cart').hasClass("disabled") || $('.btnQuickOrder').hasClass("btn-outstock");
        if (disableClick)
            return;

        var skuArr = [];
        var skuValue = $(this).attr('data-sku');
        var colorValue = $('#colorOptions .selected').attr('data-id');
        var colorId = $(this).attr('data-colorid'); //-1 ko xđ màu

        if (skuValue.indexOf(",") > 0) {
            skuArr = skuValue.split(",");
        } else {
            skuArr.push(skuValue);
        }
        //var skuId = $(this).attr('data-sku');
        var inCarts = cartGetCookie();


        //Lấy gói mua kèm
        var allAddOn = [];
        $("#product-addon-content .add-on-item input:checked").each(function() {
            allAddOn.push(parseInt($(this).val()));
        });


        //console.log(inCarts);
        skuArr.forEach(function(skuId, index) {
            //checkExits
            if (inCarts) {
                var idxUpdate = inCarts.findIndex(obj => obj.sku == skuId);
                if (colorValue && colorId != '-1')
                    idxUpdate = inCarts.findIndex(obj => obj.sku == skuId && obj.color == colorValue);
                if (idxUpdate >= 0) {
                    inCarts[idxUpdate].number++;
                    inCarts[idxUpdate].addOn = allAddOn;
                } else {
                    inCarts.push({
                        sku: skuId,
                        number: 1,
                        color: (colorId) ? colorId : colorValue,
                        addOn: allAddOn
                    });

                    flyToElement(that, $('#cart-total'));
                }
            } else {
                inCarts.push({
                    sku: skuId,
                    number: 1,
                    color: colorValue,
                    addOn: allAddOn
                });
            }
        });
        $.cookie('_cart', JSON.stringify(inCarts), {
            path: "/"
        });
        checkTotalCart();

        //Mở thông báo
        event.preventDefault();
        this.blur();
        var html = '<div class="cart-msg">'
        html += '<p><i class="icon-checked"></i> <span>Thêm giỏ hàng thành công</span></p>';
        html += '<a class="button" href="/gio-hang">Xem giỏ hàng và thanh toán</a>';
        html += '</div>';
        $.toast({
            text: html,
            position: 'bottom-center',
            stack: false,
            loader: false,
            hideAfter: 10000
        });

    });
    checkTotalCart();
}


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


////By pass cho phép đặt hàng ngay cả khi không có
//Bỏ comment
function outStockMessage() {
    var totalStore = $(".check-stock .store ul li.instock").not(".hide").length;
    var storeInstock = totalStore <= 0;
    var skuInLimit = $('#colorOptions .selected').attr('data-buyonline') == 'false';
    var colorName = $('#colorOptions .selected').attr('data-name');


    $('p span.colorName').text(' - ' + colorName);
    //console.log('storeInstock' + storeInstock);
    //console.log('skuInLimit' + skuInLimit);

    if (storeInstock || skuInLimit) { //Hết hàng hoặc giới hạn đặt
        if (skuInLimit && !storeInstock) {
            $("p.out-noonline").show(); //Nếu bị giới hạn
            $("p.out-stock").hide();
        } else if (storeInstock) {
            $("p.out-stock").show();
            $("p.out-noonline").hide();
        }

        //$(".product-action .btnbuy").not(".disabled").addClass("btn-outstock");
    } else {
        $("p.out-stock").hide();
        $("p.out-noonline").hide();
        //$(".product-action .btnbuy").not(".disabled").removeClass("btn-outstock");
    }
    $(".product-action .btnbuy").removeClass("btn-outstock");

    if (totalStore > 0) {
        $('#stock-sum').html("<label>Có <strong>" + totalStore + "</strong> cửa hàng còn sản phẩm</label>");
    } else {
        $('#stock-sum').html("");
    }
}



function replyCommentReview() {
    $('.replyReviewHolder input').focus(function() {
        var modelId = $(this).attr('data-id');
        var holder = $(this).parent();
        $(holder).hide();
        var htmlTemplate = $('#replyReviewTemplate').html();
        var container = $(this).parent().parent().find(".form-container");
        $(container).html(htmlTemplate);
        $(container).find('input[name=ModelID]').val(modelId);
        $(container).find('textarea').focus();
    });
    commentReviewPager();
}

function replyCommentComment() {
    $('.replyCommentHolder input').focus(function() {
        var modelId = $(this).attr('data-id');
        var holder = $(this).parent();
        $(holder).hide();
        var htmlTemplate = $('#replyCommentTemplate').html();
        var container = $(this).parent().parent().find(".form-container");
        $(container).html(htmlTemplate);
        $(container).find('input[name=SupportCommentID]').val(modelId);
        $(container).find('textarea').focus();
    });
    commentReviewPager();
}

function commentReviewPager() {
    //pager
    $('.review-content ol li a').not('.active').off();
    $('.review-content ol li a').not('.active').click(function() {

        var req = $(this).attr('data-req');
        if (req) {
            req = decodeURIComponent(req);
            var container = $(this).parent().parent().parent();
            var dataReq = JSON.parse(req);
            $.post(dataReq.path, dataReq, function(data) {
                $(container).html(data);
                scrollTo($(container));
            });
        }
        return false;
    });
}


//Valid reply form
function replyComment(replyForm) {

    var form = $(replyForm);
    var msg = validateForm(form);
    var containerSelect = $(replyForm).attr('data-container');
    var includeChild = $(replyForm).attr('data-child') == 'true';
    var container = $(replyForm).parent().parent().find(containerSelect);
    if (msg == '') {
        postValue = $(form).serializeObject(); //Get new val
        $.post('/api/comment', postValue, function(xhrdata) {
            if (xhrdata.Errors) {
                $.toast({
                    heading: 'Có lỗi khi gửi bình luận.',
                    text: xhrdata.Message,
                    showHideTransition: 'fade',
                    icon: 'error',
                    hideAfter: 15000
                });
            } else {
                $.toast({
                    heading: xhrdata.Title,
                    showHideTransition: 'fade',
                    icon: 'success',
                    hideAfter: 15000
                });
                $(form).find('textarea').val('');

                var parentId = (postValue.SupportCommentID) ? postValue.SupportCommentID : 0;
                ajaxLoadComment(postValue.ModelID, postValue.SystemTypeID, 1, container, parentId, includeChild, true);
            }
        });
    } else {
        $.toast({
            heading: 'Bạn cần kiểm tra lại thông tin.',
            text: msg,
            showHideTransition: 'fade',
            icon: 'error',
            hideAfter: 15000
        });
    }
    return false;
}


function showSticker(adsId) {
    var popupCookie = $.cookie('sticker_' + adsId);
    if (popupCookie == 'undefined' || popupCookie == null) {
        var urlContent = "/Ajax/AdsStickerFooter/" + adsId;
        $.post(urlContent, function(html) {
            $("#sticker-modal").html(html);
        });
    }
}

function showPopup(adsId) {
    var popupCookie = $.cookie('popup_' + adsId);
    if (popupCookie == 'undefined' || popupCookie == null) {
        var urlContent = "/Ajax/AdsPopup/" + adsId;
        $.post(urlContent, function(html) {
            if (html != '') {

                $("#popup-modal").html(html).modal({
                    closeClass: 'icon-minutes',
                    closeText: ' '
                });
            }
        });
    }
}


var specsHeight;
var setProductContentHeighWithSpecs = function() {
    //Set chiều cao cột nội dung trái =  phải, thực hiện chức năng ẩn hiện bớt nội dung quá dài

    $(".product-spect-img img").ready(function() {
        specsHeight = $(".product-specs").height() - 56;
        $("#productContent").attr("data-height", specsHeight);
        $("#productContent").height(specsHeight);
    });


    $("#viewMoreContent").click(function() {
        event.preventDefault();
        this.blur();

        var changeText = $(this).text() == 'Thu gọn' ? 'Xem thêm' : 'Thu gọn';
        $(this).text(changeText);

        if (changeText == 'Thu gọn') {
            $("#productContent").css({
                height: 'auto',
                overflow: "auto"
            });
        } else {
            $("#productContent").css({
                height: specsHeight,
                overflow: "hidden"
            });
        }
    });
}


function scrollTo(obj) {
    $('html, body').animate({
        scrollTop: $(obj).offset().top - 50
    }, 500);
}



$.fn.serializeObject = function() {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name]) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};


jQuery.fn.extend({
    autoHeight: function() {
        function autoHeight_(element) {
            return jQuery(element)
                .css({
                    'height': 'auto',
                    'overflow-y': 'hidden'
                })
                .height(element.scrollHeight - 40);
        }
        return this.each(function() {
            autoHeight_(this).on('input', function() {
                autoHeight_(this);
            });
        });
    }
});


$(function() {

    var originalAjaxMethod = jQuery.ajax;

    jQuery.ajaxSetup({
        timeout: 1 * 60000
    });
    // Define overriding method.
    jQuery.ajax = function(data) {
        // reset the timer
        // Execute the original method.        
        NProgress.start();
        return originalAjaxMethod.apply(this, arguments)
            .done(function(xhr) {
                NProgress.done();
                //$('.lazy').lazy();
            })
            .fail(function(req, status, err) {
                $.toast({
                    text: "Có lỗi rảy ra, vui lòng bấm F5 để thử lại",
                });
                NProgress.done();
            });
    }

    // Store a reference to the original remove method.
    var originalGetMethod = jQuery.get;
    // Define overriding method.
    jQuery.get = function(data) {
        // reset the timer
        // Execute the original method.        
        NProgress.start();
        return originalGetMethod.apply(this, arguments)
            .done(function(xhr) {
                NProgress.done();
                //$('.lazy').lazy();
            })
            .fail(function(req, status, err) {
                $.toast({
                    text: "Có lỗi rảy ra, vui lòng bấm F5 để thử lại",
                });
                NProgress.done();
            });
    }


    var originalPostMethod = jQuery.post;
    // Define overriding method.
    jQuery.post = function(data) {
        // reset the timer
        NProgress.start();
        return originalPostMethod.apply(this, arguments)
            .done(function(xhr) {
                NProgress.done();
                //$('.lazy').lazy();
            })
            .fail(function(req, status, err) {
                $.toast({
                    text: "Có lỗi rảy ra, vui lòng bấm F5 để thử lại",
                });
                NProgress.done();
            });
    }
});




function flyToElement(flyer, flyingTo) {
    var $func = $(this);
    var divider = 3;
    var flyerClone = $(flyer).clone();
    $(flyerClone).css({
        position: 'absolute',
        top: $(flyer).offset().top + "px",
        left: $(flyer).offset().left + "px",
        opacity: 1,
        'z-index': 1000
    });
    $('body').append($(flyerClone));
    var gotoX = $(flyingTo).offset().left + ($(flyingTo).width() / 2) - ($(flyer).width() / divider) / 2;
    var gotoY = $(flyingTo).offset().top + ($(flyingTo).height() / 2) - ($(flyer).height() / divider) / 2;

    $(flyerClone).animate({
            opacity: 0.4,
            left: gotoX,
            top: gotoY,
            width: $(flyer).width() / divider,
            height: $(flyer).height() / divider
        }, 500,
        function() {
            $(flyingTo).fadeOut('fast', function() {
                $(flyingTo).fadeIn('fast', function() {
                    $(flyerClone).fadeOut('fast', function() {
                        $(flyerClone).remove();
                    });
                });
            });
        });
}


jQuery.event.special.touchstart = {
    setup: function(_, ns, handle) {
        if (ns.includes("noPreventDefault")) {
            this.addEventListener("touchstart", handle, {
                passive: false
            });
        } else {
            this.addEventListener("touchstart", handle, {
                passive: true
            });
        }
    }
};


/////Đăng ký sản phẩm liên quan
//$(document).ready(function () {
//    $('.head-filter ul li a').click(function () {
//        var isShowAll = $(this).attr('data-show-all');
//        var targetDiv = $(this).attr('data-id');
//        targetDiv = '*[data-id=' + targetDiv + ']';
//        $('.head-filter ul li a').removeClass('active');
//        $(this).addClass('active');


//        $(".ref-product-slick").slick('slickUnfilter');
//        if (!isShowAll) {
//            $('.ref-product-slick').slick('slickFilter', targetDiv);
//        }

//    });

//    $('.ref-product-slick').slick();
//});


//chức năng đăng ký trôi bảo hành
function quickTBH() {
    $('.btnQuickTBHscription').click(function(event) {
        var StockMayCuTBHID = $(this).attr('data-id');
        var urlFormOrder = '/ajax/quickTBH?StockMayCuTBHID=' + StockMayCuTBHID;
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
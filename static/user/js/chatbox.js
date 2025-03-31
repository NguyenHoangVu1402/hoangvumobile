////Use local storage for store local data
//var ls;
//ls = localStorage;

//// Reference the auto-generated proxy for the hub.
//var chat = $.connection.chatHub;
//// Create a function that the hub can call back to display messages.
//chat.client.receivedMessage = function (message) {
//    console.log(message);
//    //Append html
//    $('#chatMessages').append(`
//        <div class="bx-message bx-user-admin">
//            <div>
//                <a href="/" title="CÔNG TY CỔ PHẦN XÂY DỰNG VÀ ĐẦU TƯ THƯƠNG MẠI HOÀNG HÀ">
//                    <img src="/Content/web_detail/img/admin chat.png" alt="CÔNG TY CỔ PHẦN XÂY DỰNG VÀ ĐẦU TƯ THƯƠNG MẠI HOÀNG HÀ">
//                </a>
//            </div>
//            <div class="message">
//                <div>
//                    <p>
//                        ${message}
//                    </p>
//                </div>
//            </div>
//        </div>
//    `);
//};

//// Start the connection.
//$.connection.hub.start().done(function () {
//    chat.server.createConversation(); //Tạo cuộc hội thoại
//}).fail(function (reason) {
//});

function chatbox() {
    $('#btn-chatbox .chat-button').click(function() {
        $('#ContactForConsultation').toggle();
    });
    $('#ContactForConsultation .fs-closes').click(function() {
        $('#ContactForConsultation').hide();
    });
    $('#btn-chatbox .chatbox').click(function() {
        $('#btn-chatbox').hide();
        $('#chatbox-info').show();
    });
    $('#chatbox-info .fs-closes').click(function() {
        $('#chatbox-info').hide();
        $('#btn-chatbox').show();
    });
}

$(document).ready(function() {
    chatbox();
    $('#chatForm').on('submit', function(e) {
        e.preventDefault();

        var textValue = $('#textMessages').val().trim();

        if (textValue) {
            $('#chatMessages').append(`
                <div class="bx-message bx-user-client">
                    <div class="message">
                        <div>
                            <p>
                                ${textValue}
                            </p>
                        </div>
                    </div>
                </div>
            `);

            $('#textMessages').val('');

            chat.server.sendToAdmin(textValue);

        } else {
            alert("Bạn chưa nhập tin nhắn.");
        }
    });

    $('#textMessages').on('keypress', function(e) {
        if (e.which === 13) {
            e.preventDefault();
            $('#chatForm').trigger('submit');
        }
    });
});
$(function() {

    var $sendButton = $('#gen-send-button');
    var $messageInput = $('#gen-message-input');

    var messageInput = document.getElementById('gen-message-input');

    var myusername = sessionStorage.getItem('username');

    var generalChannel = io.connect('/general_channel');

    var usernameExist = sessionStorage.getItem('usernameExist');
    // console.log("messageInput ", messageInput);

    if (messageInput) {


        if (usernameExist === null) {
            generalChannel.emit('add user', myusername);
            sessionStorage.setItem('usernameExist', 'yes');
        }

        generalChannel.on('user added', function(data) {
            appendMessage(data);
        });

        generalChannel.on('user joined', function(data) {
            appendMessage(data);
        });

        generalChannel.on('message', function(data) {
            appendMessage(data)
        });


        $sendButton.on('click', function() {
            sendMessage();
        });

        $messageInput.on('keypress', function(event) {
            if (event.which === 13) {
                event.preventDefault();
                sendMessage();
            }
        });

        var chatSessions = sessionStorage.getItem('generalChat');
        if (chatSessions) {
            $('#gen-message-list').html(chatSessions);
            checkScrollPosition();
        }

        function sendMessage(event) {
            var message = $messageInput.val();
            // console.log(message);
            if (!message) {
                return;
            } else {
                var data = {
                    message: message,
                    owner: myusername,
                    type: 'userMessage'
                };
                generalChannel.emit('message', JSON.stringify(data));
                // console.log(data);
            }
            $messageInput.val('');
        }

        function appendMessage(data) {
            data = JSON.parse(data);
            // console.log('testing', data);
            if (data) {
                var html = '<span class="vertical">' + '<span id="username">' + data.owner +
                    ':' + '</span>' + '<div id="message" style="margin-left: 10px;">' + data.message + '</div>' + '</span>';
                $('#gen-message-list').append($('<div>').html(html));
                checkScrollPosition();
                sessionStorage.setItem('generalChat', $('#gen-message-list').html());
            }
        }

        function checkScrollPosition() {
            // $('#gen-message-list').scrollTop($('#gen-message-list')[0].scrollHeight);
            $('#gen-message-list').animate({ scrollTop: $('#gen-message-list').prop('scrollHeight') }, 1000);
        }

    }


});




// console.log(html);
// var div = document.createElement('div');
// div.innerHTML += html
// document.getElementById('message-list').appendChild(div);


// message.onclick = function(event) {
//     if (event.keyCode === 13) {
//         event.preventDefault();
//         sendMessage();
//     }
// }
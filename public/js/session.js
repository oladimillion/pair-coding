$(function() {
    var result = undefined;

    var textarea = document.getElementById('editor');
    var $sessSendButton = $('#sess-send-button');
    var $sessMessage = $('#sess-message-input');
    var $saveCodeButton = $('#save-code');
    var $sessStatus = $('#session-status');

    var sessionChannel = io.connect('/session_channel');


    var myusername = sessionStorage.getItem('username');
    var altSession = sessionStorage.getItem('session');

    var setSessionName = decodeURI((RegExp("session" + '=' + '(.+?)(&|$)').exec(location.search) || [, null])[1]);

    var sessionName = altSession || setSessionName;

    var sessionUsernameExist = sessionStorage.getItem('sessionUsernameExist');

    if (textarea) {

        var value = "// The bindings defined specifically in the Sublime Text mode\nvar bindings = {\n";
        var map = CodeMirror.keyMap.sublime;
        for (var key in map) {
            var val = map[key];
            if (key != "fallthrough" && val != "..." && (!/find/.test(val) || /findUnder/.test(val)))
                value += "  \"" + key + "\": \"" + val + "\",\n";
        }
        value += "}\n\n// The implementation of joinLines\n";
        value += CodeMirror.commands.joinLines.toString().replace(/^function\s*\(/, "function joinLines(").replace(/\n  /g, "\n") + "\n";

        var editor = CodeMirror.fromTextArea(textarea, {
            value: value,
            lineNumbers: true,
            mode: "javascript",
            keyMap: "sublime",
            autoCloseBrackets: true,
            matchBrackets: true,
            showCursorWhenSelecting: true,
            theme: "monokai",
            tabSize: 2,
        }); // http://localhost:8000/session?session=test

        console.log('this is sessionName ', sessionName);

        console.log('sessionUsernameExist', sessionUsernameExist);

        if (sessionUsernameExist === null) {

            sessionChannel.emit('add user', myusername);
            sessionStorage.setItem('sessionUsernameExist', 'yes');
        } else {
            sessionChannel.emit('okay', JSON.stringify({
                name: sessionName,
                username: myusername
            }));
        }

        // sessionChannel.on('test', function(data) {
        //     // appendMessage(data);
        //     // console.log(data);
        // });

        sessionChannel.on('user added', function(data) {
            // console.log(data);
            appendMessage(data);
            sessionChannel.emit('join_session', { 'name': sessionName });
        });

        sessionChannel.on('user joined', function(data) {
            // console.log('user joined', data);
            appendMessage(data);
        });

        sessionChannel.on('message', function(data) {
            appendMessage(data);
        });

        sessionChannel.on('editorUpdate', function(data) { updateEditor(data) });



        $sessSendButton.on('click', function() {
            sendMessage();
        });


        $sessMessage.on('keypress', function(event) {
            if (event.which === 13) {
                event.preventDefault();
                sendMessage();
            }
        });

        editor.on('keyup', function() {
            broadcastCode();
        });

        $saveCodeButton.on('click', function() {
            var code = editor.getValue();
            console.log(code);

            if (code) {
                var requestData = {
                    username: 'oladimeji',
                    keyword: sessionName,
                    session_data: code
                };

                $.post('/session/save', requestData, function(data) {
                    if (!data.success) {
                        addRemoveClass($sessStatus, 'failure', 'success', data.message);

                    } else {
                        addRemoveClass($sessStatus, 'success', 'failure', data.message);
                    }
                });

            } else {
                addRemoveClass($sessStatus, 'failure', 'success', 'Textarea can not be empty');
            }
        });

        var chatSessions = sessionStorage.getItem('chat');
        if (chatSessions) {
            $('#sess-message-list').html(chatSessions);
        }

        var codeSession = sessionStorage.getItem('code');
        if (codeSession) {
            editor.setValue(codeSession);
            checkScrollPosition()
        }

        function broadcastCode() {
            var data = {
                name: sessionName,
                username: myusername,
                code: editor.getValue(),
                type: 'userCode'
            };
            sessionChannel.emit('editorUpdate', JSON.stringify(data));
            sessionStorage.setItem('code', data.code);
        }

        function appendMessage(data) {
            data = JSON.parse(data);
            var html = '<span class="vertical">' + '<span id="username">' + data.owner +
                ':' + '</span>' + '<div id="message" style="margin-left: 10px;">' + data.message + '</div>' + '</span>';

            $('#sess-message-list').append($('<div>').html(html));

            checkScrollPosition();

            sessionStorage.setItem('chat', $('#sess-message-list').html());
        }

        function sendMessage() {
            var message = $sessMessage.val();
            // console.log(message);
            if (!message) {
                return;
            } else {
                var data = {
                    name: sessionName,
                    username: myusername,
                    owner: myusername,
                    message: message,
                    type: 'userMessage'
                };
                sessionChannel.emit('message', JSON.stringify(data));
            }
            $sessMessage.val("");
        }

        function updateEditor(data) {
            data = JSON.parse(data);
            editor.setValue(data.code);
            sessionStorage.setItem('code', data.code);
        }

        function checkScrollPosition() {
            // $('#gen-message-list').scrollTop($('#gen-message-list')[0].scrollHeight);
            $('#sess-message-list').animate({ scrollTop: $('#sess-message-list').prop('scrollHeight') }, 1000);
        }

        function addRemoveClass($element, add, remove, message) {
            $element.addClass(add)
				.removeClass(remove)
				.html(message);
        }

    }
});

// console.log(html);
// var div = document.createElement('div');
// div.innerHTML += html
// $('message-list').appendChild(div);

// function getContent() {
//     var code = $('content');
//     var result = code.innerHTML;
//     if (!result) return "";
//     return result;
// }

// console.log(data.contents.charAt(data.contents.length - 1));
// editor.focus();
// if (data.contents.charAt(data.contents.length - 1) == ')' ||
//     data.contents.charAt(data.contents.length - 1) == '}') {
//     editor.setCursor(0);

// } else {
//     editor.setCursor(1, 0);
// }
// editor.setByApi = false;

// editor.setByApi = true;
// editor.replaceRange(data.contents, CodeMirror.Pos(editor.lastLine()));
// console.log(editor.getValue());
// sessionChannel.emit('editorUpdate', {
//     contents: editor.getValue()
// });
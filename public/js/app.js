$(function() {
    var result = undefined;
    var sessionChannel = io.connect("/session_channel");

    var textarea = document.getElementById('editor');
    var $sessSendButton = $('#sess-send-button');
    var $sessMessage = $('#sess-message-input');
    var $saveCodeButton = $('#save-code');


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
        });

        sessionChannel.on('new-user', function(data) {
            appendMessage(data);
        });

        sessionChannel.on('message', function(data) {
            appendMessage(data)
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
            broadcastCode();
        });

        function broadcastCode() {
            var data = {
                code: editor.getValue(),
                type: 'userCode'
            };
            sessionChannel.emit('editorUpdate', JSON.stringify(data));
        }

        function appendMessage(data) {
            data = JSON.parse(data);
            var html = '<span class="vertical">' + '<span id="username">' + data.type +
                ':' + '</span>' + '<span id="message" style="margin-left: 10px;">' + data.message + '</span>' + '</span>';

            $('#sess-message-list').append($('<div>').html(html));
        }

        function sendMessage() {
            var value = $sessMessage.val();
            // console.log(value);
            if (!value) {
                return;
            } else {
                var data = {
                    message: value,
                    type: 'userMessage'
                };
                sessionChannel.emit('message', JSON.stringify(data));
            }
            $sessMessage.val("");
        }

        function updateEditor(data) {
            data = JSON.parse(data);
            // console.log(data);
            if (data.type != 'myCode') {
                editor.setValue(data.code);
            }
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
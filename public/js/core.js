$(function() {

    console.log(sessionStorage.getItem("username"));

    var $username = $('#username');
    var $email = $('#email');
    var $password = $('#password');
    var $cpassword = $('#cpassword');
    var $rememberMe = $('#remember');
    var $window = $(window);


    var $signupButton = $('#signup-button');
    var $loginButton = $('#signin-button');
    var $regStatus = $('#reg-status');
    var $loginStatus = $('#login-status');
    var $logoutButton = $('#logout');

    var $openSession = $('#open-session');
    var $createSession = $('#create-session');
    var $sessionKeyword = $('#session-keyword');
    var $homeStatus = $('#home-status');


    // REGISTERING USER
    $signupButton.on('click', function(event) {
        event.preventDefault();

        var usernameVal = $username.val();
        var emailVal = $email.val();
        var passwordVal = $password.val();
        var cpasswordVal = $cpassword.val();

        if (usernameVal == '' || emailVal == '' || passwordVal == '' || cpasswordVal == '') {
            addRemoveClass($regStatus, 'failure', 'success', 'All fields are required!');
            return;
        }

        if (passwordVal != cpasswordVal) {
            addRemoveClass($regStatus, 'failure', 'success', 'Passwords don\'t match');
            return;
        }

        var requestData = {
            username: usernameVal,
            email: emailVal,
            password: passwordVal
        }

        $.post('/register', requestData, function(data) {
            console.log(data);
            if (!data.success) {
                addRemoveClass($regStatus, 'failure', 'success', data.message);
            } else {
                addRemoveClass($regStatus, 'success', 'failure', data.message);
                setTimeout(function() {
                    $window.attr('location', '/'); //redirects to login.html
                }, 2000);
            }
        });

    });


    // AUTHENTICATING USER
    $loginButton.on('click', function(event) {
        event.preventDefault();


        var usernameVal = $username.val();
        var passwordVal = $password.val();
        var rememberVal = $rememberMe.is(':checked') ? true : false;

        if (usernameVal == '' || passwordVal == '') {
            addRemoveClass($loginStatus, 'failure', 'success', 'All fields are required!');
            return;
        }

        if (usernameVal.length < 2 || passwordVal.length < 2) {
            addRemoveClass($loginStatus, 'failure', 'success', 'Two or more character long required for each field!');
            return;
        }

        var requestData = {
            username: usernameVal,
            remember: rememberVal,
            password: passwordVal
        }

        // console.log(requestData);

        $.post('/login', requestData, function(data) {
            if (!data.success) {
                addRemoveClass($loginStatus, 'failure', 'success', data.message);

            } else {
                addRemoveClass($loginStatus, 'success', 'failure', data.message);
                sessionStorage.setItem('username', data.username);
                setTimeout(function() {
                    $window.attr('location', '/home'); //redirects to home.html
                }, 2000);
            }
            // console.log(data);
        });


    });

    //OPENING EXISTING SESSION
    $openSession.on('click', function(event) {
        event.preventDefault();

        var keyword = $sessionKeyword.val();
        // keyword = String(keyword);
        if (keyword.indexOf(' ') != -1) {
            addRemoveClass($homeStatus, 'failure', 'success', 'space(s) not supported');
            return;
        }
        if (keyword.length == 0) {
            addRemoveClass($homeStatus, 'failure', 'success', 'Session keyword field can not be empty');
            return;
        }

        $.post('/session/open', { username: 'oladimeji', keyword: keyword }, function(data) {
            // console.log(data);
            if (!data.success) {
                addRemoveClass($homeStatus, 'failure', 'success', data.message);
            } else {
                addRemoveClass($homeStatus, 'success', 'failure', data.message);
                sessionStorage.setItem('code', data.session_data);
                setTimeout(function() {
                    $window.attr('location', '/session?session=' + keyword);
                }, 2000);
            }
        });
    });

    //CREATING NEW SESSION
    $createSession.on('click', function(event) {
        event.preventDefault();
        var keyword = $sessionKeyword.val();
        // keyword = String(keyword);
        if (keyword.indexOf(' ') != -1) {
            addRemoveClass($homeStatus, 'failure', 'success', 'space(s) not supported');
            return;
        }
        if (keyword.length == 0) {
            addRemoveClass($homeStatus, 'failure', 'success', 'Session keyword field can not be empty');
            return;
        }

        $.post('/session/create', { keyword: keyword }, function(data) {
            // console.log(data);
            if (!data.success) {
                addRemoveClass($homeStatus, 'failure', 'success', data.message);

            } else {
                addRemoveClass($homeStatus, 'success', 'failure', data.message);
                $window.attr('location', '/session?session=' + keyword);
            }
        });


    });

    // LOGGING OUT USER
    $logoutButton.on('click', function(event) {
        event.preventDefault();

        sessionStorage.removeItem('username');
        sessionStorage.removeItem('session');
        sessionStorage.removeItem('chat');
        sessionStorage.removeItem('code');
        sessionStorage.removeItem('generalChat');
        sessionStorage.removeItem('sessionUsernameExist');
        sessionStorage.removeItem('usernameExist');

        $.post('/logout', function() {})

        $window.attr('location', '/'); //redirects to login.html

        addRemoveClass($loginStatus, 'success', 'failure', 'You are logged out successfully');
    });

    function addRemoveClass($element, add, remove, message) {
        $element.addClass(add)
			.removeClass(remove)
			.html(message);
    }

});
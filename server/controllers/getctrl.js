// route.get('*', function(req, res, next) {
//     if ((req.url != '/') && (req.session.userid == null)) {
//         res.render('register');
//         return;
//     } else if ((req.url != '/register') && (req.session.userid == null)) {
//         res.render('login');
//         return;
//     }

//     if (((req.url === '/') || (req.url === '/register') || (req.url === '/install')) && (req.session.userid)) {
//         res.render('home');
//         return;
//     }
//     next();
// });


route.get('/session', function(req, res) {
	console.log('query ', req.query.session);
	if (!req.query.session) {
		res.render('inner/home', {
			state: 'failure',
			message: "You must open or create a session"
		});
	} else {
		res.render('inner/session');
	}
});

route.post('/logout', function(req, res) {
	// Destroy the session
	req.session.destroy(function(err) {
		// res.render('outer/login', { state: 'success', message: 'You are logged out successfully' });
	});
});
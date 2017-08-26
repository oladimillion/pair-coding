const models = require('../models/models');

var User = models.user;
var Session = models.session;

var routes = function(route) {


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

	route.get('/', function(req, res) {
		res.render('outer/login');
	});


	//AUTHENTICATION USERS
	route.post('/login', function(req, res) {


		if (req.body.username == null || req.body.username == "" ||
			req.body.password == null || req.body.password == "") {
			res.json({
				success: false,
				message: "All fields are required!"
			});
		}

		User.findOne({
				username: req.body.username
			})
			.select("username email password")
			.exec(function(err, user) {
				if (err) {
					throw err;
				} else if (user) {
					var validPassword = user.comparePassword(req.body.password);
					if (!validPassword) {
						res.json({
							success: false,
							message: "Invalid Password"
						});
					} else {
						req.session.userid = user._id;
						req.session.username = user.username;
						req.session.email = user.email;

						console.log(req.session);
						res.json({
							success: true,
							username: user.username,
							message: "Welcome"
						});
					}
				} else {
					res.json({
						success: false,
						message: "Invalid Username"
					});
				}
			});

	});


	route.get('/register', function(req, res) {
		res.render('outer/register');
	});

	// REGISTERING USERS
	route.post('/register', function(req, res) {
		// console.log(req.body);
		// res.json({ message: 'Registration Completed' });

		var user = new User();
		user.username = req.body.username;
		user.email = req.body.email.toLowerCase();
		user.password = req.body.password;
		if (req.body.username == null || req.body.username == "" ||
			req.body.email == null || req.body.email == "" ||
			req.body.password == null || req.body.password == "") {
			//checks for null or void input
			res.json({
				success: false,
				message: "Ensure all field are filled in"
			});
		}
		user.save().then(function(result) {
			// return res.render('outer/login', { state: 'success', message: 'Registration Successful' });
			res.json({
				success: true,
				message: "Registration Successful"
			});
		}, function(err) {
			if (err.code === 11000) {
				res.json({
					success: false,
					message: "Username or Email already exist"
				});
			}
		});

	});

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

	route.post('/session/create', function(req, res) {

		var keyword = {
			username: req.body.username,
			keyword: req.body.keyword
		};
		// console.log('keyword ', keyword);

		Session.findOne(keyword).then(function(result) {
			console.log('result ', result);
			if (result == null) {
				res.json({
					success: true,
					message: 'Welcome'
				});
			} else {
				res.json({
					success: false,
					message: 'keyword already exist'
				});
			}

		}, function(error) {
			console.log(error);
		});
	});

	route.post('/session/open', function(req, res) {

		var data = {
			username: req.body.username,
			keyword: req.body.keyword
		};
		// console.log('keyword ', keyword);

		Session.findOne(data, function(error, result) {
			console.log('result ', result);
			if (error) {
				throw error;
			} else if (result === null) {
				res.json({
					success: false,
					message: 'File don\'t exist'
				});
			} else if (result != null) {
				res.json({
					success: true,
					session_data: result.session_data,
					message: 'File loaded!'
				});
			}
		});

	});

	route.post('/session/save', function(req, res) {
		var data = {
			username: req.body.username,
			keyword: req.body.keyword
		};
		// console.log('keyword ', keyword);

		Session.findOne(data, function(error, result) {
			console.log('result ', result);

			if (error) {
				throw error;
			} else if (result != null) {
				// res.json({ result: data });

				result.username = result.username;
				result.keyword = result.keyword;
				result.session_data = req.body.session_data;

				// Save the updated document back to the database
				result.save(function(err, data) {
					if (err) {
						res.json({
							success: false,
							message: 'Session could not be saved'
						});
						console.log('session error 1st ', error);
					} else {
						res.json({
							success: true,
							message: 'Session saved successfully'
						});
					}
				});
			} else if (result === null) {
				var session = new Session({
					username: req.body.username,
					keyword: req.body.keyword,
					session_data: req.body.session_data
				});

				session.save(function(error, data) {
					// console.log('session data ', data);
					if (error) {
						res.json({
							success: false,
							message: 'Session could not be saved'
						});
						console.log('session error 2nd ', error);
					} else {
						res.json({
							success: true,
							message: 'Session saved successfully'
						});
					}
				});
			}
		});
	});

	route.get('/home', function(req, res) {
		res.render('inner/home');
	});


	route.get('/chat', function(req, res) {
		res.render('inner/chat');
	});

	route.get('/install', function(req, res) {

		var user = new User({
			username: 'dimeji',
			email: 'akandeoladimeji9@gmail.com',
			password: '123',
		});

		user.save().then((result) => {
			return res.render('puter/login', {
				state: 'success',
				message: 'Default Account Created'
			});
		}, function(err) {
			if (err.code === 11000) {
				return res.render('outer/login', {
					state: 'success',
					message: 'Default account already exist'
				});
			}
		});

	});

	route.post('/logout', function(req, res) {
		// Destroy the session
		req.session.destroy(function(err) {
			// res.render('outer/login', { state: 'success', message: 'You are logged out successfully' });
		});
	});

	route.use(function(req, res) {
		res.type('text/html');
		res.status(404);
		res.render('inner/404');
	});

	route.use(function(err, req, res, next) {
		console.log(err.stack);
		res.status(500);
		res.render('500');
	});



};

function Authenticated(req, res) {

};

module.exports = routes;
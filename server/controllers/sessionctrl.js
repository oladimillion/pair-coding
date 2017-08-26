const models = require('../models/models');

const {
	Session
} = models;

function create(req, res) {

	const {
		username,
		title,
		session_data
	} = req.body;
	// console.log('keyword ', keyword);

	const errors = {};

	if (username == null || username == "") {
		errors.username = "username is required";
	}

	if (title == null || title == "") {
		errors.title = "title is required";
	}

	if (Object.keys(errors).length != 0) {
		return res.status(400).json({
			success: false,
			message: errors
		});
	}

	const session = new Session({
		username,
		title,
		session_data
	});

	session.save()
		.then(function(result) {
			// registration successful

			return res.status(200).json({
				success: true,
				message: "Done"
			});


		})
		.catch(function(err) {

			if (err.errmsg) {
				if (err.errmsg.indexOf('duplicate key error') != -1) {

					//unique error occured

					const errors = {};

					if (err.errmsg.indexOf('title_1') != -1) {
						errors.title = "title already taken";
					}


					if (Object.keys(errors) != 0) {
						return res.status(400).json({
							success: false,
							message: errors
						});
					} else {
						throw err;
					}

				}
			} else {

				//validation error occured

				const {
					title,
				} = err.errors;

				const errors = {};

				if (title != undefined) {
					errors.title = title.message;
				}


				if (Object.keys(errors) != 0) {
					return res.status(400).json({
						success: false,
						message: errors
					});
				} else {
					throw err;
				}
			}
		});
}


function open(req, res) {

	const {
		username,
		title
	} = req.body;


	Session.findOne({
		username,
		title
	}, function(error, result) {
		if (error) {
			throw error;
		} else if (result == null) {
			return res.status(400).json({
				success: false,
				message: "session with that title don't exist"
			});
		} else if (result != null) {
			return res.status(200).json({
				success: true,
				message: result.session_data
			});
		}
	});
}


function update(req, res) {

	const {
		username,
		title,
		session_data
	} = req.body;

	const conditions = {
		username,
		title
	}
	const update = {
		session_data
	};

	Session.update(conditions, update, callback);

	function callback(err, numAffected) {
		// numAffected is the number of updated documents
		if (err) {
			throw err;
		}

		if (numAffected.n == 1) {
			if (numAffected.nModified == 0) {
				return res.status(401).json({
					success: false,
					message: "no changes made"
				});
			}

			return res.status(200).json({
				success: true,
				message: "saved"
			});
		} else {
			return res.status(200).json({
				success: true,
				message: "not saved"
			});
		}
	}
}

module.exports = {
	open,
	update,
	create
}
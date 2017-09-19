const models = require( '../models/models' );

const {
	User
} = models;

function signin( req, res ) {

	const { username, password } = req.body;

	if ( username == null || username == "" ||
		password == null || password == "" ) {
		return res.status( 400 ).json( {
			success: false,
			message: "All fields are required!"
		} );
	}

	User.findOne( {
			username: username
		} )
		.select( "username email password" )
		.exec( function ( err, user ) {
			if ( err ) {
				throw err;
			} else if ( user ) {
				var validPassword = user.comparePassword( password );
				if ( !validPassword ) {
					return res.status( 400 ).json( {
						success: false,
						message: "Invalid Password"
					} );
				} else {
					req.session.userid = user._id;
					req.session.username = user.username;
					req.session.email = user.email;

					// console.log(req.session);
					return res.status( 200 ).json( {
						success: true,
						message: "Welcome"
					} );
				}
			} else {
				return res.status( 400 ).json( {
					success: false,
					message: "Invalid Username"
				} );
			}
		} );
}

function signup( req, res ) {

	const { username, email, password, cpassword, phone } = req.body;

  const errors = {};

  const re = /[\s]?[\w+\d+]{4,}/g

  if ( username == null || username == "" ) {
    errors.username = "username is required";
  }

  if ( email == null || email == "" ) {
    errors.email = "email is required";
  }

  if ( phone == null || phone == "" ) {
    errors.phone = "phone is required";
  }

  if ( password == null || password == "" ) {
    errors.password = "password is required";
  }

  if ( password != cpassword ) {
    errors.password = "Password must match";
  }

  if ( Object.keys( errors ).length != 0 ) {
    return res.status( 400 ).json( {
      success: false,
      message: errors
    } );
  }

  const user = new User();

  user.username = username;
  user.email = email.toLowerCase();
  user.password = password;
  user.phone = phone;

  user.save()
    .then( function ( result ) {
      // registration successful

      return res.status( 200 ).json( {
        success: true,
        message: "Registration Successful"
      } );


    } )
    .catch( function ( err ) {

      if ( err.errmsg ) {
        if ( err.errmsg.indexOf( 'duplicate key error' ) !== -1 ) {

          //unique error occured

          const errors = {};

          if ( err.errmsg.indexOf( 'username_1' ) !== -1 ) {
            errors.username = "username already taken";
          }

          if ( err.errmsg.indexOf( 'email_1' ) !== -1 ) {
            errors.email = "email already taken";
          }

          if ( err.errmsg.indexOf( 'phone_1' ) !== -1 ) {
            errors.phone = "phone already taken";
          }

          if ( Object.keys( errors ) != 0 ) {
            return res.status( 400 ).json( {
              success: false,
              message: errors
            } );
          } else {
            throw err;
          }

        }
      } else {

        //validation error occured

        const {
          username,
          password,
          email,
          phone
        } = err.errors;

        const errors = {};

        if ( username != undefined ) {
          errors.username = username.message;
        }

        if ( password != undefined ) {
          errors.password = password.message;
        }

        if ( email != undefined ) {
          errors.email = email.message;
        }

        if ( phone != undefined ) {
          errors.phone = phone.message;
        }


        if ( Object.keys( errors ) != 0 ) {
          return res.status( 400 ).json( {
            success: false,
            message: errors
          } );
        } else {
          throw err;
        }
      }
    } );
}

module.exports = {
  signup,
  signin
}

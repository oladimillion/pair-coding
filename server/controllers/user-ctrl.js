const jwt = require("jsonwebtoken");
const bycrypt = require('bcrypt-nodejs');

const models = require( '../models/models' );
const { isValidLoginData }  = require("../utils/validations")
const { isValidRegData, isValidProfileData }  = require("../utils/validations")
const { isValidResetPwData, isValidEmail }  = require("../utils/validations")
const { sendMail, createToken, duplicateError } = require("../utils/user-utils")

const {	User, Session, PasswordReset } = models;

function signin( req, res ) {

  // validating user's data
  let message = isValidLoginData(req.body);

	if (message) {
		return res.status(401).json({ success: false, message });
	}

	const { username, password } = req.body;

	User.findOne({
			username: username
		})
		.select( "username email phone password" )
		.exec( function ( err, user ) {
			if ( err ) {
				throw err;
			} else if ( user ) {
				var validPassword = user.comparePassword( password );
				if ( !validPassword ) {
          // invalid password provided
					return res.status(401).json( {
						success: false,
						message: "Invalid credentials provided"
					} );
        } else {
          // giving user a token which is needed 
          // for authentication
          const token = jwt.sign({
            username: user.username,
            email: user.email,
            phone: user.phone
          }, process.env.JWT_SECRET);

          return res.status(201).json({
            success: true,
            message: "Welcome",
            payload: token
          });
        }
      } else {
        // credentials cannot be verified
        return res.status(401).json({
          success: false,
          message: "Invalid credentials provided"
        });
      }
    } );
}

function signup(req, res) {

  // validating user's data
  let message = isValidRegData(req.body);

  if (message) {
    return res.status(400).json({ success: false, message });
  }
  const { username, email, password, phone } = req.body;

  const user = new User();

  user.username = username;
  user.email = email.toLowerCase();
  user.password = password;
  user.phone = phone;

  user.save()
    .then(function (result) {
      // registration successful
      return res.status( 201 ).json({
        success: true,
        message: "Registration Successful!.\nYou may now login"
      });

    })
    .catch( function (err) {

      if (err) {
        // some data provided by the user 
        // already exist
        return duplicateError(res, err)
      } else {
        //validation error occured
        const { username, password, email, phone } = err.errors;

        let error = "";

        if ( username != undefined ) {
          error = username.message + "\n";
        }

        if ( password != undefined ) {
          error = password.message + "\n";
        }

        if ( email != undefined ) {
          error = email.message + "\n";
        }

        if ( phone != undefined ) {
          error = phone.message + "\n";
        }

        if ( error ) {
          return res.status( 400 ).json( {
            success: false,
            message: error
          } );
        } else {
          throw err;
        }
      }
    } );
}

function passwordReset (req, res){

  let { email, password, cpassword, token } = req.body;

  // verifying password reset token
  PasswordReset.findOne({
    token
  })
    .select("token")
    .exec(function (err, data) {
      if(err || !data){
        // token invalid
        return res.status(400).json({
          success: false,
          message: "Link is invalid",
        })
      }
      else
      {
        // valid token provided      

        // validating data from user
        let message = isValidResetPwData(email, password, cpassword );

        if (message) {
          return res.status(401).json({ success: false, message });
        }
        const conditions = { email }

        User.findOne(conditions).select('email password')
          .exec(function (err, data) {

            if(!data) {
              // remove token and corresponding data from db
              PasswordReset.findOneAndRemove({token}, ()=>{})

              return res.status(400).json({
                success: false,
                message: "Email doesn't exist!"
              });
            } else {
              let samePassword = data.comparePassword(password);

              if(samePassword) {
                // old and new password matches
                return res.status(400).json({
                  success: false,
                  message: "You can't use same old password"
                });
              } else {
                // encrypting password
                password = bycrypt.hashSync(password);
                let update = { password };

                // updating password
                User.update(conditions, update, (err, numAffected) => {
                  if (err) {
                    throw err;
                  } else {
                    // removing password reset token and corresponding data from db
                    PasswordReset.findOneAndRemove({token}, ()=>{})

                    return res.status(201).json({
                      success: true,
                      message: "Password successfully reset"
                    });

                  }
                });

              }
            }
          })
      }
    });

}

function passwordResetLink (req, res){
  let { email } = req.body;

  let message = isValidEmail(email);

  if (message) {
    return res.status(400).json({ success: false, message });
  }

  // verify user's email
  User.findOne({
    email
  })
    .select("email")
    .exec(function(err, user) {
      if(err) 
      {
        throw err;
      } 
      else if(user) 
      {
        // has user requested for password reset before?
        PasswordReset.findOne({
          email
        })
          .select("token email time")
          .exec(function (err, data) {
            if (err) 
            {
              throw err;
            } 
            else if (data) 
            {
              // user has before requested for password reset, 
              // so overwrite existing data
              data.token = createToken();
              data.email = email;
              data.time = Date.now();

              data.save(function(err) {
                if(err)
                {
                  // an error occured
                  return res.status(400).json({
                    success: false,
                    message: "Request could not be completed. Try again!"
                  })
                } 
                else
                {
                  // sending user an email containing password reset link
                  return sendMail(res, email, data.token);
                }
              });

            } 
            else 
            {
              // user has not before requested for password reset link.
              // create token and send user an email containing password reset link
              let reset = new PasswordReset({
                token: createToken(),
                email,
                time: Date.now()
              });

              reset.save()
                .then((data) => {
                  // sending user an email containing password reset link
                  return sendMail(res, email, data.token);

                })
                .catch((err) => {
                  // an error occured
                  return res.status(400).json({
                    success: false,
                    message: "Request could not be completed. Try again!"
                  })
                })
            }
          });
      }
      else 
      {
        // no such email
        return res.status(400).json({
          success: false,
          message: "Email doesn't exist!"
        });
      }
    });
}

function profileUpdate(req, res) {

  let message = isValidProfileData(req.body);

  if (message) {
    return res.status(400).json({ success: false, message });
  }
  let { username, email, password, phone, opassword, _username, _email, _phone } = req.body;

  // fetching user data, using this conditions
  const conditions = { username: _username, email: _email, phone: _phone };

  User.findOne(conditions).select('username phone email password')
    .exec(function (err, data) {

      if(!data) {
        // data could not be verified
        return res.status(401).json({
          success: false,
          message: "Invalid credentials provided!"
        });

      } else {

        let auth = data.comparePassword(opassword);

        if(!auth){
          // password needed to update profile
          return res.status(401).json({
            success: false,
            message: "Your password is incorrect"
          });
        }

        let samePassword = data.comparePassword(password);

        if(samePassword) {
          // old and new password are the same
          return res.status(400).json({
            success: false,
            message: "You can't use same old password"
          });

        } else {
          // encrypting password before saving to the db
          password = bycrypt.hashSync(password || opassword);
          let update = { username, email, password, phone };

          User.update(conditions, update, (err, numAffected) => {
            if (err) {
              // someone else already has data provided by the user
              return duplicateError(res, err)
            } else {

              let token = undefined;

              if(username != _username || email != _email || phone != _phone){

                if(username != _username){
                  // updating all sessions owned by user after username change
                  Session.update({username: _username}, {username}, {multi: true}, (err) => {
                    if(err)
                      throw err;
                  })

                }
                // giving user a new token after successful profile update
                token = jwt.sign({
                  username: username,
                  email: email,
                  phone: phone
                }, process.env.JWT_SECRET);
              }
              return res.status(201).json({
                success: true,
                message: "Profile successfully updated",
                payload: token
              });
            }
          })
        }
      }
    })
}

function verifyPasswordResetToken(req, res){
  const token = req.params.token;

  PasswordReset.findOne({
    token
  })
    .select("email time")
    .exec(function (err, data) {
      if (err) 
      {
        throw err;
      } 
      else if (data) 
      {
        const {email, time} = data;

        if((Date.now() - time) > 86400000)
        {
          // password reset token has expired
          // remove password reset token and corresponding data from db 
          PasswordReset.findOneAndRemove({token}, ()=>{})

          return res.status(400).json({
            success: false,
            message: "Link has expired",
          })
        }
        else
        {
          // return user's email based on password reset token provided
          return res.status(201).json({
            payload: data.email
          })
        }
      }
      else 
      {
        // password reset token not found
        return res.status(400).json({
          success: false,
          message: "Link is invalid",
        })
      }
    })
}

module.exports = { signup, signin, passwordReset, passwordResetLink, profileUpdate,
  verifyPasswordResetToken};

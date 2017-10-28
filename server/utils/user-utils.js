const NodeMailer = require("./nodemailer-utils")

function createToken(len = 20, chars = "abcdefghjkmnopqrstuvwxyzABCDEFGHJKLMNOPQRSTUVWXYZ0123456789")
{
  // generating token
  let token = "";
  while(len--)
  {
    token += chars[Math.random() * chars.length | 0]
  }

  return token;
}


function duplicateError(res, err){
  //duplicate error 
  if (err.errmsg.indexOf('duplicate key error') !== -1 ) {
    let error = "";
    if ( err.errmsg.indexOf('username_1') !== -1 ) {
      error = "Username already taken\n";
    }

    if ( err.errmsg.indexOf('email_1') !== -1 ) {
      error = "Email already taken\n";
    }

    if ( err.errmsg.indexOf('phone_1') !== -1 ) {
      error = "Phone number already taken\n";
    }

    if (error) {
      return res.status(400).json( {
        success: false,
        message: error
      });
    } 
  } else {
    throw err;
  }
}

function sendMail(res, email, token)
{
  const _email = {
    subject: "Reset your Pair-Coding password",
    text: `Someone (hopefully you) has requested a password reset for your Heroku account. 
           Follow the link below to set a new password: 
           http://localhost:8000/password-reset/${token}
           If you don't wish to reset your password, disregard this email and no 
           action will be taken.`,
    html: `
          <html>
            <head>
              <style>
                html{
                 font-size: 16px;
                }
                p, a{
                 font-size: 1.1em;	
                }
             </style>
           </head>
           <body>
             <p>Someone (hopefully you) has requested a password reset for your Pair-Coding account. 
                Follow the link below to set a new password: </p> <br/>
             <a href="http://localhost:8000/password-reset/${token}"> <strong> http://localhost:8000/password-reset/${token}</strong></a><br/>	
             <p>If you don't wish to reset your password, disregard this email and no 
                action will be taken.</p>
           </body>
         </html>`
  }

  return NodeMailer(email, _email.subject, _email.text, _email.html, (err) => {
    if(err)
    {
      return res.status(400).json({
        success: false,
        message: "Request could not be completed. Try again..." 
      })
    }

    return res.status(201).json({ success: true,
      message: "Check your inbox for password reset link" });        

  })
}

module.exports = {
  createToken, sendMail, duplicateError 
}

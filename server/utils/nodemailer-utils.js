const nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, 
  auth: {
    type: 'OAuth2',
    user: "bootloop.dev@gmail.com",
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
    accessToken: process.env.ACCESS_TOKEN,
    expires: 3000
  }
});


function NodeMailer(to, subject, text, html, callback)
{
  // setup email data
  let mailOptions = {
    from: '"Pair - Coding" <bootloop.dev@gmail.com>', // sender address
    to: to, // list of receivers
    subject: subject, // Subject line
    text: text, // plain text body
    html: html // html body
  };

  // send mail with defined transport object
  return transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("NodeMailer:ERROR: ", error);
      return callback(error)
    }

    if(info){
      console.log('Message sent: %s', info.messageId);
      return callback();
    }
  });
}

module.exports = NodeMailer;

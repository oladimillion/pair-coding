const models = require('../models/models');
const { Session } = models;
const {testTitle} = require("./validations");

function createSession(res, data, newSession = false){

  const { username, title, id, content, description, time } = data;

  let message = "";

  if(!testTitle(title)){
    message= "Title requires 4-20 length of characters"
  }

  if(!time || !username || !id){
    message = "All fields are required";
  }

  if (message) {
    return res.status(400).json({
      success: false,
      message
    });
  }

  // if username and title already exist, then it's update session request 
  Session.findOne({
    username, title
  })
    .select("id username title content time")
    .exec(function (err, data) {

      function savedData()
      {
        data.id = data.id;
        data.username = username;
        data.title = title;
        data.content = content || data.content;
        data.time = time;
        data.save(function(err) {
          if(err)
          {
            // an error occured
            return res.status(400).json({
              success: false,
              message: "Not saved!"
            })
          } 
          else
          {
            return res.status(201).json({
              success: true,
              message: "Saved!"
            })
          }
        });

      }

      if (err) 
      {
        throw err;
      } 
      else if (data) 
      {
        if(data.id == id) {
          // this is the original creator of 
          // the session, so perform session update 
          return savedData()
        } else if(data.username == username 
          && data.title == title && newSession){
          // it's create session request, and
          // title already taken from the user
          return res.status(400).json({
            success: false,
            message: "Title already taken!"
          })
        }  else if(data.username == username 
          && data.title == title && !newSession){
          // user is not the original creator of the 
          // session, but has a clone of it,
          // therefore, perform session update 
          return savedData()
        }
      } else {
        // if username and title doesn't exist, 
        // then it's create session request 
        return createNewSession();
      } 
    });

  function createNewSession(){
    // if username and title doesn't exist, then it's create session  
    const session = new Session({ 
      id, username, title, content, description, time
    });

    session.save()
      .then(function(result) {
        // session created successfully
        return res.status(200).json({
          success: true,
          message: "Created!"
        });
      })
      .catch(function(err) {

        if (err.errmsg) {
          if (err.errmsg.indexOf('duplicate key error') != -1) {
            //unique error occured
            message = "";

            if (err.errmsg.indexOf('id_1') != -1) {
              message = "Id already taken";
            }

            if (message) {
              return res.status(400).json({
                success: false,
                message
              });
            } else {
              throw err;
            }

          }
        } else {
          throw err;
        }
      });
  }
}

module.exports = {
  createSession,
}

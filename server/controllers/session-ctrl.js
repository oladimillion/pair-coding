const models = require('../models/models');
const { Session } = models;

const {createSession} = require("../utils/session-utils");
const {testTitle} = require("../utils/validations");


function create(req, res) {
  return createSession(res, req.body, true);
}

function fetchOne(req, res) {

  if( !req.params.id ){
    return res.status(400).json({
      success: false,
      message: "Session not found"
    })
  }

  const { id } = req.params;

  Session.findOne({
    id
  }, function(error, result) {
    if (error) {
      throw error;
    } else if (result == null) {
      return res.status(400).json({
        success: false,
        message: "Session not found"
      });
    } else if (result != null) {

      // filtering out necessary data from db
      const filteredResult = {};
      filteredResult.username = result.username;
      filteredResult.title = result.title;
      filteredResult.id = result.id;
      filteredResult.content = result.content;
      filteredResult.description = result.description;
      filteredResult.time = result.time;

      return res.status(200).json({
        success: true,
        payload: filteredResult,
        message: "Done!"
      });
    }
  });
}

function fetchAll(req, res) {

  // making sure query object is not empty
  // ie: username not provided
  if( Object.keys(req.query).length  == 0 ){
    return res.status(400).json({
      success: false,
      message: "Please login!"
    })
  }

  const { username } = req.query;

  Session.find({
    username
  }, function(error, result) {
    if (error) {
      throw error;
    } else if (result == null) {
      // user have no session created
      return res.status(400).json({
        success: false,
        message: "No session yet"
      });
    } else if (result != null) {

      let filteredResult = result.map((data) => {

        // filtering out necessary data from db
        let temp = {};
        temp.username = data.username;
        temp.title = data.title;
        temp.id = data.id;
        temp.content = data.content;
        temp.description = data.description;
        temp.time = data.time;

        return temp;
      });

      return res.status(200).json({
        success: true,
        payload: filteredResult,
        message: "Done!"
      });
    }
  });

}

function updateSession(req, res) {

  const { id, title, description, username, content, time } = req.body;

  Session.findOne({
    id
  })
    .select("content time")
    .exec(function (err, data) {
      if (err) 
      {
        throw err;
      } 
      else if (data) 
      {
        // update session for the user, 
        data.content = content;
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
              message: "Saved!",
            })
          }
        });

      } else {
        // session does exit, but not for the 
        // user making update request, 
        // therefore, clone the session for the user
        return createSession(res, req.body);
      } 

    });
}

function updateSessionDetail(req, res) {

  const { id, username, title, description } = req.body;

  if(!testTitle(title)){
    message= "Title requires 4-20 length of characters"
  }

  Session.findOne({
    id
  })
    .select("username title description")
    .exec(function (err, data) {
      function savedData(){
        // function to save session detail
        data.username = username;
        data.title = title;
        data.description = description;
        data.save(function(err) {
          if(err)
          {
            // an error occured
            return res.status(400).json({
              success: false,
              message: "Not Updated!"
            })
          } 
          else
          {
            return res.status(201).json({
              success: true,
              message: "Updated!"
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
        if(data.username == username && data.title != title)
        {
          // user has provided a new title
          //check whether user already has session with this title
          Session.findOne({
            username, title
          })
            .select("title")
            .exec(function (err, _data) {
              if(err) throw err;

              if(_data) {
                // title already taken from the user
                return res.status(400).json({
                  success: false,
                  message: "Title already taken!"
                })
              } else {
                //update session detail
                return savedData();
              }
            });

        } 
        else if(data.username == username && data.title == title)
        {
          // user has only changed session description
          // update session detail
          return savedData();
        }
        else 
        {
          // user trying to update session is not the owner
          return res.status(400).json({
            success: false,
            message: "Not Allowed!"
          })
        } 

      }
      else {
        // session doesn't exit
        return res.status(400).json({
          success: false,
          message: "Not found!"
        })
      } 
    });
}

function deleteSession(req, res){
  const {id} = req.params;

  Session.findOneAndRemove({id}, function(err, session){
    if(err){
      throw err
    }

    if(session){
      return res.status(200).json({
        success: true,
        message: "Deleted!"
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Not Deleted!"
      });
    }

  })
}

module.exports = {
  fetchOne, updateSession, create, fetchAll, updateSessionDetail, deleteSession
};

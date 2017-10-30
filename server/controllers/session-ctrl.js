const models = require('../models/models');

const { Session } = models;

function create(req, res) {

  const { username, title, id, content, description, time } = req.body;

  let message = "";

  const re = /[\s]?[\w+\W+]{4,20}/;

  if(!title || !re.test(title)){
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

  const session = new Session({ 
    username, title, id, content, description, time
  });

  session.save()
    .then(function(result) {
      // session created successfully
      return res.status(201).json({
        success: true,
        message: "Done"
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
        //validation error occured
        const { title } = err.errors;
        message = "";

        if (title != undefined) {
          message = title.message;
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
    });
}


function fetchOne(req, res) {

  if( !req.params.id ){
    return res.status(400).json({
      success: false,
      message: "No such resource"
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
        message: "No such resource"
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

      return res.status(201).json({
        success: true,
        payload: filteredResult,
        message: "Done!"
      });
    }
  });
}

function fetchAll(req, res) {

  // making sure query object is not empty
  if( Object.keys(req.query).length  == 0 ){
    return res.status(400).json({
      success: false,
      message: "No such resource"
    })
  }

  const { username } = req.query;

  Session.find({
    username
  }, function(error, result) {
    if (error) {
      throw error;
    } else if (result == null) {
      return res.status(400).json({
        success: false,
        message: "Session doesn't exist"
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

      return res.status(201).json({
        success: true,
        payload: filteredResult,
        message: "Done!"
      });
    }
  });

}

function updateSession(req, res) {

  const { id, content, time } = req.body;

  const conditions = { id }
  const update = { content, time };

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
          message: "No changes made"
        });
      }

      return res.status(201).json({
        success: true,
        message: "Saved"
      });

    } else {
      return res.status(400).json({
        success: false,
        message: "Not saved"
      });
    }
  }
}

function updateSessionDetail(req, res) {

  const { id, title, description } = req.body;

  const conditions = { id }
  const update = { title, description };

  const re = /[\s]?[\w+\W+]{4,20}/;

  if(!title || !re.test(title)){
    return res.status(401).json({
      success: false,
      message: "Title requires 4-20 length of characters"
    })
  }

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
          message: "No changes made"
        });
      }

      return res.status(201).json({
        success: true,
        message: "Saved"
      });

    } else {
      return res.status(400).json({
        success: false,
        message: "Not saved"
      });
    }
  }
}

function deleteSession(req, res){
  const {id} = req.params;

  Session.findOneAndRemove({id}, function(err, session){
    if(err){
      throw err
    }

    if(session){
      return res.status(201).json({
        success: true,
        message: "Deleted"
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Not Deleted"
      });
    }

  })
}

module.exports = {
  fetchOne, updateSession, create, fetchAll, updateSessionDetail, deleteSession
};

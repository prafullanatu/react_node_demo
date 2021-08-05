const Authuser = require("../models/authuser.model.js");

// Create and Save a new Authuser
exports.create = (req, res) => {

};

// Retrieve all Authusers from the database.
exports.findAll = (req, res) => {
  Authuser.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving authusers."
      });
    else {
      var i =1;
      data.forEach(element => {
        element.serialNo = i;
        //console.log(element);
        i++;
      });
      res.send(data)};
  });
};

exports.getAllBySearchText = (req, res) => {
  Authuser.findAllBySearchText(req, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Authuser with id ${req.cmsUserAuthenticationID}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Authuser with id " + req.params.cmsUserAuthenticationID
        });
      }
    } else {
      var i =1;
      data.forEach(element => {
        element.serialNo = i;
        //console.log(element);
        i++;
      });
      res.send(data);
    }
  });
};
// Find a single Authuser with a authuserId
exports.findOne = (req, res) => {

};


exports.getAuthuserById = (req, res) => {
  Authuser.findByAuthUserId(req.cmsUserAuthenticationID, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Authuser with id ${req.cmsUserAuthenticationID}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Authuser with id " + req.params.cmsUserAuthenticationID
        });
      }
    } else {
      res.send(data);
    }
  });
};

exports.addEditAuthuser = (req, res) => {
  Authuser.addEditAuthuser(req, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Authuser with id ${req.cmsUserAuthenticationID}.`
        });
      } else {
        res.status(500).send({
          message: "Error editing Authuser with id "
        });
      }
    } else {
      res.send(data);
    }
  });
};


exports.activechangeAuthuser = (req, res) => {
  Authuser.activechangeAuthuser(req, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Authuser with id ${req.cmsUserAuthenticationID}.`
        });
      } else {
        res.status(500).send({
          message: "Error editing Authuser with id "
        });
      }
    } else {
      res.send(data);
    }
  });
};

exports.deleteAuthuser = (req, res) => {
  Authuser.deleteAuthuser(req, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Authuser with id ${req.cmsUserAuthenticationID}.`
        });
      } else {
        res.status(500).send({
          message: "Error editing Authuser with id "
        });
      }
    } else {
      res.send(data);
    }
  });
};

// Find a single Authuser with a authuserId
exports.findByUserNamePsw = (req, res) => {

  Authuser.findByUsernamePassword(req.uname, req.upsw, (err, data) => {
    let success = 0;
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Authuser with id ${req.upsw}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Authuser with id "
        });
      }
    }
    if (typeof data !== 'undefined') {
      res.send({
        success: '1',
        message: data
      });
    }
    else
      res.send({
        success: '-1',
        message: 'Invalid Username/Password'
      });
  });
};

// Update a Authuser identified by the authuserId in the request
exports.update = (req, res) => {

};

// Delete a Authuser with the specified authuserId in the request
exports.delete = (req, res) => {

};

// Delete all Authusers from the database.
exports.deleteAll = (req, res) => {

};
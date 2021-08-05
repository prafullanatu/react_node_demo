var md5 = require('md5');
const sql = require("./db.js");

// constructor
const Authuser = function (authuser) {
  this.CMSUsername = authuser.CMSUsername;
  this.CMSPassword = authuser.CMSPassword;
  this.CMSUserIsActive = authuser.CMSUserIsActive;
};

Authuser.create = (newAuthuser, result) => {
  sql.query("INSERT INTO cmsusersauthentication SET ?", newAuthuser, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created authuser: ", { id: res.insertId, ...newAuthuser });
    result(null, { id: res.insertId, ...newAuthuser });
  });
};

Authuser.findById = (userId, result) => {
  sql.query(`SELECT cu.CmsUserAuthenticationID, cu.CMSUsername, cu.CMSUserIsActive,
  cp.CMSUserFirstname, cp.CMSUserMiddlename, cp.CMSUserLastname, cp.CMSUserGender,  
  cp.CMSUserPersonalEmail, cp.CMSUserLocalAddress, cp.CMSUserState, cp.CMSUserCity, cp.CMSUserZipcode,
  co.visionmission, co.CMSClientPersonalDescription, co.CMSClientPersonalImgPath,
  co.CMSClientPoliticalDescription, co.CMSClientPoliticalImgPath, co.CMSClientSocialDescription,
  co.CMSClientSocialImgPath FROM cmsusersauthentication cu 
  LEFT JOIN cmsuserpersonaldetails cp ON cu.CmsUserAuthenticationID = cp.CmsUserAuthenticationID
  LEFT JOIN cmsclientdetails co ON cu.CmsUserAuthenticationID = co.CmsUserAuthenticationID 
  WHERE cu.id = ${userId}`, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      if (res.length) {
        console.log("found authuser: ", res[0]);
        result(null, res[0]);
        return;
      }

      // not found Authuser with the id
      result({ kind: "not_found" }, null);
    });
};

Authuser.findByAuthUserId = (userId, result) => {
  var userDetails = {};

  sql.query(`SELECT cu.CmsUserAuthenticationID, cu.CMSUsername, cu.CMSUserIsActive,
  cp.CMSUserFirstname, cp.CMSUserMiddlename, cp.CMSUserLastname, cp.CMSUserGender,  
  cp.CMSUserPersonalEmail, cp.CMSUserLocalAddress, cp.CMSUserState, cp.CMSUserCity, cp.CMSUserZipcode,
  co.visionmission, co.CMSClientPersonalDescription, co.CMSClientPersonalImgPath,
  co.CMSClientPoliticalDescription, co.CMSClientPoliticalImgPath, co.CMSClientSocialDescription,
  co.CMSClientSocialImgPath FROM cmsusersauthentication cu 
  LEFT JOIN cmsuserpersonaldetails cp ON cu.CmsUserAuthenticationID = cp.CmsUserAuthenticationID
  LEFT JOIN cmsclientdetails co ON cu.CmsUserAuthenticationID = co.CmsUserAuthenticationID 
  WHERE cu.CmsUserAuthenticationID = ${userId}`, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      if (res.length) {
        result(null, res[0]);
        return;
      }

      // not found Authuser with the id
      result({ kind: "not_found" }, null);

    });
};


Authuser.findByUsernamePassword = (userName, psw, result) => {

  psw = md5(psw);

  sql.query(`SELECT * FROM cmsusersauthentication WHERE CMSUsername = '${userName}'
   AND CMSPassword = '${psw}' `, (err, res) => {

      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
      if (res.length > 0) {
        result(null, res[0]);
      } else {
        result(null);
      }

    });
};


Authuser.getAll = result => {
  sql.query(`SELECT cu.CMSUserAuthenticationID, cu.CMSUserRoleID, cu.CMSUserParentID, 
  cu.CMSUsername, cu.CMSUserIsActive, cu.CMSUserLastLogin, cu.CMSUserLoginAttempts,
  cu.CMSUserDisplayname, cu.CMSUserGUID,
  cp.CMSUserFirstname, cp.CMSUserMiddlename, cp.CMSUserLastname, cp.CMSUserGender,  
  cp.CMSUserPersonalEmail, cp.CMSUserLocalAddress, cp.CMSUserState, cp.CMSUserCity, cp.CMSUserZipcode,
  co.visionmission, co.CMSClientPersonalDescription, co.CMSClientPersonalImgPath,
  co.CMSClientPoliticalDescription, co.CMSClientPoliticalImgPath, co.CMSClientSocialDescription,
  co.CMSClientSocialImgPath FROM cmsusersauthentication cu 
  LEFT JOIN cmsuserpersonaldetails cp ON cu.CmsUserAuthenticationID = cp.CmsUserAuthenticationID
  LEFT JOIN cmsclientdetails co ON cu.CmsUserAuthenticationID = co.CmsUserAuthenticationID 
  WHERE IsDeleted = 0`, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      // console.log("cmsusersauthentication: ", res);
      result(null, res);
    });
};

Authuser.findAllBySearchText = (authuser, result) => {
  const searchText = authuser.searchText;
  sql.query(`SELECT cu.CMSUserAuthenticationID, cu.CMSUserRoleID, cu.CMSUserParentID, 
  cu.CMSUsername, cu.CMSUserIsActive, cu.CMSUserLastLogin, cu.CMSUserLoginAttempts,
  cu.CMSUserDisplayname, cu.CMSUserGUID,
  cp.CMSUserFirstname, cp.CMSUserMiddlename, cp.CMSUserLastname, cp.CMSUserGender,  
  cp.CMSUserPersonalEmail, cp.CMSUserLocalAddress, cp.CMSUserState, cp.CMSUserCity, cp.CMSUserZipcode,
  co.visionmission, co.CMSClientPersonalDescription, co.CMSClientPersonalImgPath,
  co.CMSClientPoliticalDescription, co.CMSClientPoliticalImgPath, co.CMSClientSocialDescription,
  co.CMSClientSocialImgPath FROM cmsusersauthentication cu 
  LEFT JOIN cmsuserpersonaldetails cp ON cu.CmsUserAuthenticationID = cp.CmsUserAuthenticationID
  LEFT JOIN cmsclientdetails co ON cu.CmsUserAuthenticationID = co.CmsUserAuthenticationID 
  WHERE IsDeleted = 0 AND (cp.CMSUserFirstname LIKE '%`+ searchText + `%' OR cp.CMSUserMiddlename LIKE '%` + searchText + `%' OR cp.CMSUserLastname LIKE '%` + searchText + `%')`,
    [searchText],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
      result(null, res);
      return;
      console.log(res); return false;

    }
  );
};

Authuser.addEditAuthuser = (authuser, result) => {
 //console.log(authuser);return false;
  var CMSUserAuthenticationIDEdit = authuser.CMSUserAuthenticationIDEdit;
  if (CMSUserAuthenticationIDEdit == 0) {
    sql.query(
      "INSERT INTO cmsusersauthentication (CMSUsername, CMSPassword, CMSUserIsActive) " +
      " VALUES ('" + authuser.CMSUserUsernameEdit + "','" +  md5(authuser.CMSUserPasswordEdit) + "','1' )",
      (err, res) => {
        if (err) {
          console.log("error 1: ", err);
          result(null, err);
          return;
        }
        CMSUserAuthenticationIDEdit = res.insertId;
        sql.query(
          "INSERT INTO cmsuserpersonaldetails (CMSUserAuthenticationID, CMSUserFirstname,CMSUserMiddlename, CMSUserLastname,CMSUserLocalAddress, CMSUserState, CMSUserCity,CMSUserZipcode,CMSUserGender) " +
          " VALUES ('" + CMSUserAuthenticationIDEdit + "','" + authuser.CMSUserFirstnameEdit + "','" + authuser.CMSUserMiddlenameEdit + "','" + authuser.CMSUserLastnameEdit
          + "','" + authuser.CMSUserLocalAddressEdit + "','" + authuser.CMSUserStateEdit + "','" + authuser.CMSUserCityEdit + "','" + authuser.CMSUserZipcodeEdit + "', 1)",
          (err, res) => {
            if (err) {
              console.log("error 2: ", err);
              result(null, err);
              return;
            }
          }
        );
        sql.query(
          "INSERT INTO cmsclientdetails (CMSUserAuthenticationID, visionmission, CMSClientPersonalDescription, CMSClientPersonalImgPath, CMSClientSocialDescription, CMSClientSocialImgPath, " +
          " CMSClientPoliticalDescription,CMSClientPoliticalImgPath) VALUES ('" + CMSUserAuthenticationIDEdit + "','" + authuser.visionmissionEdit + "','" + authuser.CMSClientPersonalDescriptionEdit + "','" + authuser.CMSClientPersonalImgPathEdit
          + "','" + authuser.CMSClientSocialDescriptionEdit + "','" + authuser.CMSClientSocialImgPathEdit + "','" + authuser.CMSClientPoliticalDescriptionEdit + "','" + authuser.CMSClientPoliticalImgPathEdit + "')",
          (err, res) => {
            if (err) {
              console.log("error 2: ", err);
              result(null, err);
              return;
            }
          }
        );
      }
    );
  } else {
    sql.query(
      `UPDATE cmsusersauthentication SET  
     CMSUserIsActive = ? WHERE CMSUserAuthenticationID = ?`,
      [authuser.CMSUserIsActiveEdit, CMSUserAuthenticationIDEdit],
      (err, res) => {
        if (err) {
          console.log("error 1: ", err);
          result(null, err);
          return;
        }

        if (res.affectedRows == 0) {
          // not found Authuser with the id
          result({ kind: "not_found" }, null);
          return;
        }
      }
    );
    //console.log("--Update 1 --");
    sql.query(
      `UPDATE cmsuserpersonaldetails SET CMSUserFirstname = ?, CMSUserMiddlename = ?, 
    CMSUserLastname = ?,CMSUserLocalAddress = ?, CMSUserState = ?, CMSUserCity = ?, 
    CMSUserZipcode = ? WHERE CMSUserAuthenticationID = ?`, [authuser.CMSUserFirstnameEdit,
      authuser.CMSUserMiddlenameEdit, authuser.CMSUserLastnameEdit, authuser.CMSUserLocalAddressEdit,
      authuser.CMSUserStateEdit, authuser.CMSUserCityEdit, authuser.CMSUserZipcodeEdit, CMSUserAuthenticationIDEdit],
      (err, res) => {
        if (err) {
          console.log("error 2: ", err);
          result(null, err);
          return;
        }
        //  console.log("--Update 2 --");
        if (res.affectedRows == 0) {
          // not found Authuser with the id
          result({ kind: "not_found" }, null);
          return;
        }
      }
    );
    sql.query(
      `UPDATE cmsclientdetails SET visionmission = ?, CMSClientPersonalDescription = ?, 
    CMSClientPersonalImgPath = ?,CMSClientPoliticalDescription = ?, CMSClientPoliticalImgPath = ?, 
    CMSClientSocialDescription = ?, CMSClientSocialImgPath = ? 
    WHERE CMSUserAuthenticationID = ?`, [authuser.visionmissionEdit, authuser.CMSClientPersonalDescriptionEdit,
      authuser.CMSClientPersonalImgPathEdit, authuser.CMSClientPoliticalDescriptionEdit, authuser.CMSClientPoliticalImgPathEdit,
      authuser.CMSClientSocialDescriptionEdit, authuser.CMSClientSocialImgPathEdit,
        CMSUserAuthenticationIDEdit],
      (err, res) => {
        if (err) {
          console.log("error 3: ", err);
          result(null, err);
          return;
        }
        //  console.log("--Update 3 --");
        if (res.affectedRows == 0) {
          // not found Authuser with the id
          result({ kind: "not_found" }, null);
          return;
        }
      }
    );
  }
  result(null, { CMSUserAuthenticationID: CMSUserAuthenticationIDEdit, ...authuser });
};



Authuser.activechangeAuthuser = (req, result) => {

  var cmsUserAuthenticationID = req.cmsUserAuthenticationID;
  var act = (req.checked) ? 1 : 0;
  sql.query(
    `UPDATE cmsusersauthentication SET  
    CMSUserIsActive = `+ act + ` WHERE CMSUserAuthenticationID = ?`,
    [cmsUserAuthenticationID],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found Authuser with the id
        result({ kind: "not_found" }, null);
        return;
      }
    }
  );
  result(null, { cmsUserAuthenticationID: cmsUserAuthenticationID });
};

Authuser.deleteAuthuser = (cmsUserAuthenticationID, result) => {

  sql.query(
    `UPDATE cmsusersauthentication SET  
    IsDeleted = 1 WHERE CMSUserAuthenticationID = ?`,
    [cmsUserAuthenticationID],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found Authuser with the id
        result({ kind: "not_found" }, null);
        return;
      }
    }
  );
  result(null, { cmsUserAuthenticationID: cmsUserAuthenticationID });
};

Authuser.updateById = (id, authuser, result) => {
  sql.query(
    "UPDATE cmsusersauthentication SET CMSUsername = ?, CMSPassword = ?, CMSUserIsActive = ? WHERE id = ?",
    [authuser.CMSUsername, authuser.CMSPassword, authuser.CMSUserIsActive, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found Authuser with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated authuser: ", { id: id, ...authuser });
      result(null, { id: id, ...authuser });
    }
  );
};

Authuser.remove = (id, result) => {
  sql.query("DELETE FROM cmsusersauthentication WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found Authuser with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted authuser with id: ", id);
    result(null, res);
  });
};

Authuser.removeAll = result => {
  sql.query("DELETE FROM cmsusersauthentication", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} cmsusersauthentication`);
    result(null, res);
  });
};

module.exports = Authuser;
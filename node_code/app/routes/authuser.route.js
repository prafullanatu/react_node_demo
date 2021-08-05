module.exports = app => {
    const authusers = require("../controllers/authuser.controller.js");

    let bodyParser = require("body-parser");
    let multer = require('multer');
    let uploadMult = multer();
    var cors = require('cors');
    //var express = require('express');

    /** bodyParser.urlencoded(options)
     * Parses the text as URL encoded data (which is how browsers tend to send form data from regular forms set to POST)
     * and exposes the resulting object (containing the keys and values) on req.body
     */
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(cors());

    /**bodyParser.json(options)
     * Parses the text as JSON and exposes the resulting object on req.body.
     */
    app.use(bodyParser.json());

    // Create a new Authuser
    app.post("/authusers", authusers.create);

    // Retrieve all Authusers
    app.get("/authusers", authusers.findAll);

    // Retrieve all Authusers by Paging
    app.post("/authusersbysearch", (request, response) => {
        authusers.getAllBySearchText(request.body, response);
    });

    // Retrieve a single Authuser with authuserId
    app.post("/getauthuserbyid", (request, response) => {
        authusers.getAuthuserById(request.body, response);
    });

    // Edit Authuser
    app.post("/addeditauthuser", function (req, res) {
        upload(req, res, function (err) {
            //  
            const objCol = req.files;
            //console.log("sdsd "+req.body.CMSUserAuthenticationIDEdit);return false;
            if (objCol.CMSClientPersonalImgPathEdit) {
                const objPoli = objCol.CMSClientPersonalImgPathEdit;
                objPoli.forEach(element => {
                    req.body.CMSClientPersonalImgPathEdit = element.filename;
                });
            } else {
                if (req.body.CMSUserAuthenticationIDEdit === "undefined")
                    req.body.CMSClientPersonalImgPathEdit = "";
                else
                    req.body.CMSClientPersonalImgPathEdit = req.body.CMSClientPersonalImgPathEdit.replace("http://localhost:3002/authmedia/", "");
            }
            if (objCol.CMSClientPoliticalImgPathEdit) {
                const objPoli = objCol.CMSClientPoliticalImgPathEdit;
                objPoli.forEach(element => {
                    req.body.CMSClientPoliticalImgPathEdit = element.filename;
                });
            } else {
                if (req.body.CMSUserAuthenticationIDEdit === "undefined")
                    req.body.CMSClientPoliticalImgPathEdit = "";
                else
                    req.body.CMSClientPoliticalImgPathEdit = req.body.CMSClientPoliticalImgPathEdit.replace("http://localhost:3002/authmedia/", "");
            }
            if (objCol.CMSClientSocialImgPathEdit) {
                const objPoli = objCol.CMSClientSocialImgPathEdit;
                objPoli.forEach(element => {
                    req.body.CMSClientSocialImgPathEdit = element.filename;
                });
            } else {
                if (req.body.CMSUserAuthenticationIDEdit === "undefined")
                    req.body.CMSClientSocialImgPathEdit = "";
                else
                    req.body.CMSClientSocialImgPathEdit = req.body.CMSClientSocialImgPathEdit.replace("http://localhost:3002/authmedia/", "");
            }
            if (req.body.CMSUserAuthenticationIDEdit === "undefined") {
                req.body.CMSUserAuthenticationIDEdit = 0;
                req.body.CMSUserIsActiveEdit = 0;
            }
            authusers.addEditAuthuser(req.body, res);
            if (err) {
                return res.end("Error uploading file.");
            }
            //res.end("Updated");
        });
    });
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'docs/clientdbg/')
        },
        filename: function (req, file = {}, cb) {
            const ext = getExtension(file.originalname);
            cb(null, Date.now() + ext);
        }
    });

    function getExtension(filename) {
        var i = filename.lastIndexOf('.');
        return (i < 0) ? '' : filename.substr(i);
    }

    var upload = multer({ storage: storage })
        .fields([{ name: 'CMSClientPersonalImgPathEdit', maxCount: 1 },
        { name: 'CMSClientPoliticalImgPathEdit', maxCount: 1 },
        { name: 'CMSClientSocialImgPathEdit', maxCount: 1 }]
        );


    //activechangeauthuser
    app.post("/activechangeauthuser", (request, response) => {
        authusers.activechangeAuthuser(request.body, response);
    });

    app.post('/api/photo', function (req, res) {
        upload(req, res, function (err) {
            //console.log(req.body);
            //console.log(req.files);
            if (err) {
                return res.end("Error uploading file.");
            }
            res.end("File is uploaded");
        });
    });

    // Delete Authuser
    app.post("/deleteauthuser", (request, response) => {
        authusers.deleteAuthuser(request.body.cmsUserAuthenticationID, response);
    });

    app.post('/api/sayHello', (request, response) => {
        let a = request.body.a;
        let b = request.body.b;


        let c = parseInt(a) + parseInt(b);
        response.send('Result : ' + c);
        console.log('Result : ' + c);
    });
    app.post('/authusersforlogin', uploadMult.array(), (request, response) => {
        let uname = request.body.uname;
        let upsw = request.body.upsw;
        authusers.findByUserNamePsw(request.body, response);
    });



    // Update a Authuser with authuserId
    app.put("/authusers/:authuserId", authusers.update);

    // Delete a Authuser with authuserId
    app.delete("/authusers/:authuserId", authusers.delete);

    // Create a new Authuser
    app.delete("/authusers", authusers.deleteAll);
};
const express = require("express");
const router = express.Router();
var User = require("../../../models/User");



router.get("/", (req, res) => {
    User.find( function (err,data) {

        if (err) {
            console.log("error in server", err)
        } else {
            res.send({
                msg: "got userslist",
                users:data,
            });
        }
    })
    
});

module.exports = router;
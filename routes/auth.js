var express = require("express");
var router = express.Router();
var database = require("../firebase/firebase.js");
var sha256 = require("sha256");

router.post("/register", (req, res) => {
    var user = {};
    user.email = req.body.email ? req.body.email : "";
    user.username = req.body.username;
    user.password = sha256(req.body.password);
    user.type = req.body.type ? req.body.type : "";
    database.ref("users").push().set(user);
    res.status(200).send("uploaded");
});

router.post("/login", (req, res) => {
    var user = {};
    user.username = req.body.username;
    user.password = sha256(req.body.password);
    var queryBaseRef = database.ref("/users");
    const queryRef = queryBaseRef
        .orderByChild('username').equalTo(user.username)
    queryRef.once("value", (snapshot) => {
        snapshot.forEach(function (data) {
            var userBD = data.val();
            if (userBD && userBD.password == user.password) {
				var response = {};
				response.username = user.username;
				response.tip = userBD.type;
				response.id = data.key;
				console.log(response);
                res.status(200).send(response);
            } else {
                res.status(404).send("Not ok!");
            }
        });
    });
});

router.get("/users", (req, res) => {
    var users = [];
    var usersData = database.ref("users");
    usersData.once("value", (snapshot) => {
        var usersBD = snapshot.val();
        var usersIds = Object.keys(usersBD);
        for (var i = 0; i < usersIds.length; i++) {
            var currUser = usersBD[usersIds[i]];
            currUser.UID = usersIds[i];
            users.push(currUser);
        }
        res.status(200).send(users);
    });
});

module.exports = router;

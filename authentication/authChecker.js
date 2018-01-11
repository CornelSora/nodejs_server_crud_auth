var database = require("../firebase/firebase.js");

module.exports = function (req, res, next) {
    var userid = req.headers.userid;
    var queryBaseRef = database.ref("/users/" + userid);
    queryBaseRef.on("value", (snap) => {
        var user = snap.val();
        user ? next() : res.status(400).send("Not authenticated");        
    });
};
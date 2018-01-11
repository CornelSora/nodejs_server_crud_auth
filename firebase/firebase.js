var serviceAccount = require("../config/firebase-config.json");
var admin = require("firebase-admin");

var firebase = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://nodelearning-4b086.firebaseio.com"
});

var database = firebase.database();

module.exports = database;
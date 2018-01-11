var express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");

var app = express();
app.use(bodyParser());
app.use(cors());

app.use(express.static("../Proiect_TIC_HTML_CSS"));

app.get("/", (req, res) => {
    res.status(200).send("Hello world!");
})

var authRest = require("./routes/auth.js");
app.use(authRest);

var problemsRest = require("./routes/problems.js");
app.use(problemsRest);

app.listen(8080, () => {
    console.warn("server is open");
});
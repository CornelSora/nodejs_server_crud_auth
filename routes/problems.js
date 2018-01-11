var express = require("express");
var router = express.Router();
var database = require("../firebase/firebase.js");
var protected = require("../authentication/authChecker.js");

var createProblem = (denumire, dificultate, continut, userid) => {
    var problem = {};
    problem.denumire = denumire;
    problem.dificultate = dificultate;
    problem.continut = continut;
    problem.updatedBy = userid;
    return problem;
}

router.get("/problems", protected, (req, res) => {
    var problems = [];
    var problemsData = database.ref("problems");
    problemsData.once("value", (snapshot) => {
        var problemsBD = snapshot.val();
        var problemsIds = Object.keys(problemsBD);
        for (var i = 0; i < problemsIds.length; i++) {
            var currProblem = problemsBD[problemsIds[i]];
            currProblem.id = problemsIds[i];
            problems.push(currProblem);
        }
        res.status(200).send(problems);
    });
});

router.get("/problems/:id", protected, (req, res) => {
    var problems = [];
    var problemID = req.params.id;
    var problemsData = database.ref("problems/" + problemID);
    problemsData.once("value", (snapshot) => {
        var problem = {};
        problem = snapshot.val();
        problem ? problem.id = snapshot.key : null;
        res.status(200).send(problem);
    });
});

router.post("/problems", protected, (req, res) => {
    var denumire = req.body.denumire ? req.body.denumire : "";
    var dificultate = req.body.dificultate ? req.body.dificultate : 1;
    var continut = req.body.continut ? req.body.continut : "";
    var userid = req.headers.userid ? req.headers.userid : 0;
    var problem = createProblem(denumire, dificultate, continut, userid);
    database.ref("problems").push().set(problem);
    res.status(200).send("uploaded");
});

router.put("/problems/:id", (req, res) => {
    console.log("Se exec")
    var idUnic = req.params.id;
    var denumire = req.body.denumire ? req.body.denumire : "";
    var dificultate = req.body.dificultate ? req.body.dificultate : 1;
    var continut = req.body.continut ? req.body.continut : "";
    var userid = req.body.userid ? req.body.userid : 0;
    var problema = createProblem(denumire, dificultate, continut, userid);
    var updates = {};
    updates['/problems/' + idUnic] = problema;
    database.ref().update(updates);
    res.status(200).send(problema);
});

router.delete("/problems/:id", protected, (req, res) => {
    var idUnic = req.params.id;
    database.ref("problems/" + idUnic).remove();
    res.status(200).send("Object deleted");
});


module.exports = router;

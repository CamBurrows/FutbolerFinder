var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");

var PORT = process.env.PORT || 3000;
var app = express();

app.use(express.static("app/public"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var individualArr = [];
var teamArr = [];
var NewProfile;

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "app/public/home.html"));
});

app.get("/survey", function (req, res) {
    res.sendFile(path.join(__dirname, "app/public/survey.html"));
});

app.get("/api/teams", function (req, res) {
    return res.json(teamArr);
});
app.get("/api/individuals", function (req, res) {
    return res.json(individualArr);
});

app.post("/api/new", function (req, res) {
    NewProfile = req.body;
    
    if (NewProfile.searchingFor === "team"){
        individualArr.push(NewProfile)
        var differenceArray = []

        for (i = 0; i < teamArr.length; i++){
            var compareValues = teamArr[i].questions;
            var compareAgainst = NewProfile.questions;
            var totalDifference;
            console.log("compare values: " + compareValues);

            for (z = 0; z < compareValues.length; z++){
                var difference = Math.abs(parseInt(compareValues[z]) - parseInt(compareAgainst[z]));
                totalDifference += difference
            }

            console.log("total difference : " + totalDifference)
            differenceArray.push(totalDifference)
            console.log("difference array: " + differenceArray)
        }

        var lowValue = Math.min(...differenceArray);
        var match = differenceArray.indexOf(lowValue);

        console.log("Low Value: " + lowValue);
        console.log("match: " + match)
        
    }
    else {
        teamArr.push(NewProfile)
        var differenceArray = []

        for (i = 0; i < individualArr.length; i++){
            var compareValues = individualArr[i].questions;
            var compareAgainst = NewProfile.questions;
            var totalDifference;
            console.log("compareValues: " + compareValues);

            for (z = 0; z < compareValues.length; z++){
                var difference = Math.abs(parseInt(compareValues[z]) - parseInt(compareAgainst[z]));
                totalDifference += difference
            }

            console.log("total difference : " + totalDifference)
            differenceArray.push(totalDifference)
            console.log("difference array: " + differenceArray)
        }

        var lowValue = Math.min(...differenceArray);
        var match = differenceArray.indexOf(lowValue);

        console.log("Low Value: " + lowValue);
        console.log("match: " + match)
    }
    console.log(NewProfile);
    res.json(NewProfile);
})

app.listen(PORT, function () {
    console.log("Server listening on http://localhost:" + PORT);
});
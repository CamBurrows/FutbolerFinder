var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");

var PORT = process.env.PORT || 3000;
var app = express();

app.use(express.static("app/public"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//array which will hold objects of those submitting as individuals
var individualArr = [];

//array which will hold objects of those submitting as a team
var teamArr = [];

//global which will hold the current data of NewProfile, which will be sent via post request
var NewProfile;

var currentMatch;


//routes
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
    
    //conditional which says if user is searching for a team, do this
    if (NewProfile.searchingFor === "team"){
        individualArr.push(NewProfile)
        var differenceArray = []

        //conditional which says if array of team data is not empty, do this
        if (teamArr.length != 0){

            //loops through array of team objects
            for (i = 0; i < teamArr.length; i++){

                //assigns variables to current question section of team object being worked on in array, and question section of NewProfile
                var compareAgainst = teamArr[i].questions;
                var compareValues = NewProfile.questions;
                var totalDifference = 0;
                console.log("compare Values: " + compareValues);
                console.log("compare Against: " + compareAgainst)

                //for the questions section, loop through each of 10 questions, find the difference between NewProfile and current team profile, keep a running total.
                for (z = 0; z < compareValues.length; z++){
                    var difference = Math.abs(parseInt(compareValues[z]) - parseInt(compareAgainst[z]));
                    totalDifference += difference
                }

                //push our running total of difference to an empty array
                console.log("total difference : " + totalDifference)
                
                differenceArray.push(totalDifference)
                console.log("difference array: " + differenceArray)
            }

            //after all entrys have been looped through, find the lowest difference value out of our difference array.
            var lowValue = Math.min(...differenceArray);
            var currentMatchIndex = differenceArray.indexOf(lowValue);
            currentMatch = teamArr[currentMatchIndex]

            console.log("Low Value: " + lowValue);
            console.log("match index: " + currentMatchIndex)
        }
        
        //if our array of team data is empty
        else {
            console.log("No match, because there are no entries to match with!")
        }
    }
    //if user is searching for an individual, and has submitted as a team
    else {
        //submit NewProfile to our array of teams
        teamArr.push(NewProfile)
        
        var differenceArray = []

        //if our array of individuals has something in it...
        if (individualArr.length != 0){
        
            //for each of the entries in our individuals array
            for (i = 0; i < individualArr.length; i++){
                
                //variables are set for the array of questions for the NewProfile, and the current one our for loop is looking at
                var compareAgainst = individualArr[i].questions;
                var compareValues = NewProfile.questions;
                var totalDifference = 0;
                console.log("compareValues: " + compareValues);
                console.log("compare Against: " + compareAgainst);

                //loop which goes through each questions of NewProfile and current stored entry we are looking at, and compares them with running total
                for (z = 0; z < compareValues.length; z++){
                    var difference = Math.abs(parseInt(compareValues[z]) - parseInt(compareAgainst[z]));
                    totalDifference += difference
                }

                //pushing each totalDifference (running total) to an empty array
                console.log("total difference : " + totalDifference)
                
                differenceArray.push(totalDifference)
                console.log("difference array: " + differenceArray)
            }

            //pulls lowest value from our array of difference values
            var lowValue = Math.min(...differenceArray);
            var currentMatchIndex = differenceArray.indexOf(lowValue);
            currentMatch = individualArr[currentMatchIndex]

            console.log("Low Value: " + lowValue);
            console.log("match index: " + currentMatchIndex)

        }

        //if the array we are comparing against is empty, do this
        else {
            console.log("No match because there are no entries in database")
        }
    }
    console.log(NewProfile);
    return res.json(NewProfile);
})

//get which send the match global var as json object
app.get("/api/match", function(req,res){
    console.log("Current match object: " + currentMatch)
    res.json(currentMatch)
})

app.listen(PORT, function () {
    console.log("Server listening on http://localhost:" + PORT);
});
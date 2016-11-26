var express = require('express');
var request = require('request');
var app = express();
var accessToken="";

var model ='https://api.projectoxford.ai/luis/v2.0/apps/ef759c58-7bca-4c77-ba28-e40146764b0b?subscription-key=dfa71d213f1b4645b249e95ece228af6'

app.get('/callback', function (req, res) {
    accessToken=req.query.code;
    console.log(accessToken);
    res.send("Access Token");
})

app.post('/accessToken',function(req,res){
    res.send(accessToken);
})

app.get('/home', function (req, res) {
    request(model+'&q='+req.query.searchQuery, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(JSON.parse(body).topScoringIntent)// Show the HTML for the Google homepage. 
        }
        res.send('Thanks. We are processing your query.');
    })
})

app.post('/home',function(req,res){
    res.send("At this moment, it is not defined.");
})

var server = app.listen(8083, function () {
    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)
})
var express = require('express');
var request = require('request');
var app = express();

app.get('/callback', function (req, res) {
    res.send("callback")
})

app.get('/callback', function (req, res) {
    request('https://api.projectoxford.ai/luis/v2.0/apps/d4d18f70-d9f8-4f71-9b0a-d5304750a7ef?subscription-key=dfa71d213f1b4645b249e95ece228af6&q=%27sam%27', function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(JSON.parse(body).topScoringIntent)// Show the HTML for the Google homepage. 
        }
        res.send('Hi')
    })
})

var server = app.listen(8083, function () {
    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)
})
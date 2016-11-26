var express = require('express');
var request = require('request');
var app = express();
var accessToken = "";
var DIGITALOCEAN = require('dropletapi').Droplets;
var model = 'https://api.projectoxford.ai/luis/v2.0/apps/ef759c58-7bca-4c77-ba28-e40146764b0b?subscription-key=dfa71d213f1b4645b249e95ece228af6'
var CODE = 'd9ab741b2548b181ef4b5e31bd57e2549f6200b838c42fbb03196fe07e4805c5';
var CLIENT_ID = 'bc9ddc5faa820489de13ac23f998fe79d55a9e880b5faaa0353321630539822d';
var CLIENT_SECRET = '257385f6b195fc8854255219540e0ff0f22d42ad2a09b5e8a2400440b0322e84';

app.get('/callback', function (req, res) {
    if (req.query.code != undefined) {
        CODE = req.query.code;
        var URL = 'https://cloud.digitalocean.com/v1/oauth/token?grant_type=authorization_code&code=' + CODE + '&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET + '&redirect_uri=http://104.131.39.100:8083/callback';
        request.post(URL, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                accessToken = JSON.parse(body).accessToken;
                res.send(JSON.parse(body));
            }
        })
    }
    else{
        res.send("please send code");
    }
})

app.post('/accessToken', function (req, res) {
    res.send(accessToken);
})

app.get('/home', function (req, res) {
    request(model + '&q=' + req.query.searchQuery, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(JSON.parse(body).topScoringIntent)// Show the HTML for the Google homepage. 
        }
        res.send('Thanks. We are processing your query.');
    })
})

app.post('/home', function (req, res) {
    res.send("At this moment, it is not defined.");
})

app.get('/createDroplet', function (req, res) {
    var digitalocean = new DIGITALOCEAN('');
    var myNewDropletData = {
        "name": "example.com",
        "region": "nyc3",
        "size": "512mb",
        "image": "ubuntu-14-04-x64",
        "ssh_keys": null,
        "backups": false,
        "ipv6": true,
        "user_data": null,
        "private_networking": null
    }

    digitalocean.createDroplet(myNewDropletData, function (error, result) {
        if (error) {
            console.log(error);
        }
        else {
            console.log(result);
        }
    });
})

var server = app.listen(8083, function () {
    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)
})
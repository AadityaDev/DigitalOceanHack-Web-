var express = require('express');
var request = require('request');
var app = express();
var accessToken = '4a51a776c8ef3d44f0820406d43fa7e51862c1951979cbd9dfe9209256519cbf';
var DIGITALOCEAN = require('dropletapi').Droplets;
var model = 'https://api.projectoxford.ai/luis/v2.0/apps/ef759c58-7bca-4c77-ba28-e40146764b0b?subscription-key=dfa71d213f1b4645b249e95ece228af6'
var CODE = '963c3bc73ac6fe55c4278c38aeb3c1fa97937fe6d721fd74bb5304dcfec8eca0';
var CLIENT_ID = 'bc9ddc5faa820489de13ac23f998fe79d55a9e880b5faaa0353321630539822d';
var CLIENT_SECRET = '257385f6b195fc8854255219540e0ff0f22d42ad2a09b5e8a2400440b0322e84';
var CREATE_DROPLET_DATA = {
    "name": 'hostname',
    "region": ['nyc1', 'nyc2', 'nyc3', 'sfo1', 'ams2', 'sgp1', 'lon1', 'nyc3', 'ams3', 'fra1', 'tor1', 'sfo2', 'blr1'],
    "size": ['512mb', '1gb'],
    "images": ['ubuntu-14-04-x64', 'ubuntu-14-04-x32']
}

app.get('/',function(req,res){
    res.send("||||| Introduction: OceanSquare is an intelligent chatbot built to assist a user in carrying out actions on the digital ocean platform.  ||||| Motivation : The aim is to simplify and ease out the actions that a user can perform on digital ocean. This is expected to attract more customers. ||||| Product Description: OceanSquare is an android app,a chatbot. A user can query the bot in simple text in natural language.The NLP module of the bot processes the query and decides about the intention of user.Based on the decision made by the NLP Engine(Luis in this case), the bot proceeds to  one of the two steps; request more information about the query as suggested by the NLP engine, or if the query is right ,fire the query on digitaloecean and ask more details from user if needed and then proceed to complete the task ,alerting the user about the status of the action. ||||| List of Actions that can be performed on digitalocean: Droplet Creation, Droplet Deletion, Droplet Modification,Get List of droplets, Get List of volumes, Get User’s Account Details, Add SSH etc. etc. |||||| OceanSquare can help a user do any of the above mentioned tasks.But due to shortage of time we have managed to make it capable of following actions as listed: ||||| List of Actions that are performed by OceanSquare: Droplet Creation,Droplet Deletion,Get List of droplets ||||| OceanSquare generates QR code for droplet configuration,which helps in duplicating a droplet and its configuration. This QR Code can be shared with friends or teams.");
})

app.get('/callback', function (req, res) {
    if (req.query.code != undefined) {
        CODE = req.query.code;
        var URL = 'https://cloud.digitalocean.com/v1/oauth/token?grant_type=authorization_code&code=' + CODE + '&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET + '&redirect_uri=http://104.131.39.100:8083/callback';
        request.post(URL, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                accessToken = JSON.parse(body).access_token;
                console.log(accessToken);
                res.setHeader('content-type', 'application/JSON')
                res.send(body);
            }
        })
    }
    else {
        res.send("please send code");
    }
})

app.post('/accessToken', function (req, res) {
    res.send(accessToken);
})

app.get('/home', function (req, res) {
    res.setHeader('content-type', 'application/JSON');
    if (req.query.searchQuery != undefined && req.query.createDropletData == undefined && req.query.deleteDropletId == undefined) {
        request(model + '&q=' + req.query.searchQuery, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(JSON.parse(body).topScoringIntent);
                var detectedIntent = JSON.parse(body).topScoringIntent.intent;
                if (detectedIntent == 'createDroplet') {
                    res.send(CREATE_DROPLET_DATA);
                } else if (detectedIntent == 'deleteDroplet') {
                    //getAllDropletDetails(res);
                    var digitalocean = new DIGITALOCEAN(accessToken);

                    digitalocean.listDroplets(function (error3, result3) {
                        if (error3) {
                            console.log(error3);
                            return error3;
                        }
                        else {
                            console.log(result3);
                            if (result3.droplets != undefined) {
                                var releventData = [];
                                for (var i = 0; i < result3.droplets.length; i++) {
                                    releventData.push({ name: result3.droplets[i].name, id: result3.droplets[i].id });
                                }
                                res.end(JSON.stringify(releventData));
                            }
                        }
                    });
                    //deleteDroplet(dropletID);
                } else {
                    res.send(detectedIntent);
                }
            }
        })
    }
    else if (req.query.createDropletData != undefined) {
        var name = JSON.parse(req.query.createDropletData).name;
        var region = JSON.parse(req.query.createDropletData).region;
        var size = JSON.parse(req.query.createDropletData).size;
        var image = JSON.parse(req.query.createDropletData).images;
        //createDroplet(name, region, size, image, res);
        var digitalocean = new DIGITALOCEAN(accessToken);
        var myNewDropletData = {
            "name": name,
            "region": region,
            "size": size,
            "image": image,
            "ssh_keys": null,
            "backups": false,
            "ipv6": true,
            "user_data": null,
            "private_networking": null
        }

        digitalocean.createDroplet(myNewDropletData, function (error1, result1) {
            if (error1) {
                console.log(error1);
                res.end(JSON.stringify(error1));
            }
            else {
                console.log(JSON.stringify(result1));
                //res.setHeader('content-type', 'application/JSON');
                res.end(JSON.stringify(result1));
            }
        });
    }
    else if (req.query.deleteDropletId != undefined) {
        //deleteDroplet(req.query.deleteDropletId, res);
        var digitalocean = new DIGITALOCEAN(accessToken);
        digitalocean.deleteDroplet(req.query.deleteDropletId, function (error2, result2) {
            if (error2) {
                console.log(error2);
                res.end(JSON.stringify(error2));
            }
            else {
                console.log(result2);
                //res.setHeader('content-type', 'application/JSON');
                res.end(JSON.stringify(result2));
            }
        });
    } else {
        res.send("please send search query.")
    }
})

function createDroplet(name, region, size, image, res) {
    var digitalocean = new DIGITALOCEAN(accessToken);
    var myNewDropletData = {
        "name": name,
        "region": region,
        "size": size,
        "image": image,
        "ssh_keys": null,
        "backups": false,
        "ipv6": true,
        "user_data": null,
        "private_networking": null
    }

    digitalocean.createDroplet(myNewDropletData, function (error1, result1) {
        if (error1) {
            console.log(error1);
            res.end(JSON.stringify(error1));
        }
        else {
            console.log(JSON.stringify(result1));
            //res.setHeader('content-type', 'application/JSON');
            res.end(JSON.stringify(result1));
        }
    });
};

function deleteDroplet(dropletID, res) {
    var digitalocean = new DIGITALOCEAN(accessToken);
    digitalocean.deleteDroplet(dropletID, function (error2, result2) {
        if (error2) {
            console.log(error2);
            res.end(JSON.stringify(error2));
        }
        else {
            console.log(result2);
            //res.setHeader('content-type', 'application/JSON');
            res.end(JSON.stringify(result2));
        }
    });
};

app.post('/home', function (req, res) {
    res.send("At this moment, it is not defined.");
})

var server = app.listen(8083, function () {
    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)
})
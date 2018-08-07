//Get modules.

//var express = require('express');
//var routes = require('./routes');
//var path = require('path');
//var app = express();
var AWS = require('aws-sdk');
var fs = require('fs');
var http = require('http');

/*app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));*/
/*app.locals.theme = process.env.THEME; //Make the THEME environment variable available to the app.*/ 

//Read config values from a JSON file.
var config = fs.readFileSync('./app_config.json', 'utf8');
config = JSON.parse(config);

//Create DynamoDB client and pass in region.
var db = new AWS.DynamoDB({region: config.AWS_REGION});

//GET home page.
//app.get('/', routes.index);

//POST signup form.
/*app.post('/signup', function(req, res) {
  var nameField = req.body.name,
      emailField = req.body.email,
      previewBool = req.body.previewAccess;
  res.send(200);
  signup(nameField, emailField, previewBool);
});*/

/*
var post= function(){
var keywords=document.getElementById('keyword');
var previous=document.referrer;
var current=window.location;
signup(keywords, previous, current);
}
*/
//Add signup form data to database.
/*var sendToServer = function (keywordSubmitted, prevSubmitted, currSubmitted) {
  var formData = {
    TableName: config.STARTUP_TABLE,
    Item: {
        id:Date.now(), 
        keyword:{'S': keywordSubmitted},
        date: {'S': new Date().toDateString()},
        time: {'S': new Time().toTimeString()},
        previous: {'S': prevSubmitted},
        current: {'S': currSubmitted}
    }
  };
  db.putItem(formData, function(err, data) {
    if (err) {
      console.log('Error adding item to database: ', err);
    } else {
      console.log('Form data added to database.');
      
    }
  }).promise();
};*/
function sendToServer(keywordSubmitted, prevSubmitted, currSubmitted) {
        $.ajax({
            method: 'POST',
            url: _config.api.invokeUrl + '/ride',
            
            data: JSON.stringify({
                PickupLocation: {
                    id:Date.now(), 
                    keyword:{'S': keywordSubmitted},
                    date: {'S': new Date().toDateString()},
                    time: {'S': new Time().toTimeString()},
                    previous: {'S': prevSubmitted},
                    current: {'S': currSubmitted}/**/
                }
            }),
            contentType: 'application/json',
            success: completeRequest,
            error: function ajaxError(jqXHR, textStatus, errorThrown) {
                console.error('Error requesting: ', textStatus, ', Details: ', errorThrown);
                console.error('Response: ', jqXHR.responseText);
                //alert('' + jqXHR.responseText);
            }
        });
    }
/*http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});*/

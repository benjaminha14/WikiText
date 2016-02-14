// Load the twilio module
var twilio = require('twilio');
var http = require("http");
var u = require("url");
var req = require("request");
var cheerio = require("cheerio");

var client = new twilio.RestClient('ACf2830c92abe86227c9d89be45345bdc1', '8994c537a323c780a92af819a238c6db');
var Firebase = require('firebase');
var dataRef = new Firebase('https://wikitalk.firebaseio.com');
var usersRef = dataRef.child("data");
//var async = require("async");
var Promise = require('promise');




// Pass in parameters to the REST API using an object literal notation. The
// REST client will handle authentication and response serialzation for you.
http.createServer(function(request, response) {
    response.writeHead(700, {
        "Content-Type": "text/bold"
    });
    
    console.log(u);
    
    //var url = "https://en.wikipedia.org/wiki/" + input;

    var resp = new twilio.TwimlResponse();
    var parts = u.parse(request.url, true);
    var query = parts.query;
    // console.log("Body: "+query.Body);
    // console.log("User Numberr: "+query.From);
    var input = query.Body;
    var userNumber = query.From;
    var reply = "";
    var count = 0;

    /*
        takes the Wikipedia reply and sends it back to user
    */
    function respondToUser(input) {
        console.log("I passed through p");
        
        count++;

        if (count < 2) {
            console.log("Reply: " + input);
            // addDataToFireBase(reply);
           // console.log(wikiReply(input));
            //wikiReply(reply);
           // console.log("Acutal Reply: " + wikiReply(input));
           console.log(input);
            client.sendMessage({

                to: userNumber,
                from: "+1844-743-9454",
                body: reply

            });
            //addDataToFireBase(input);
        } else {
            count = 0;
        }
        console.log(count);
    }

    /*
        takes input, web scrapes Wikipedia, and returns first paragraph of page
    */
        
    if (input == undefined) {
        //failure("ignore");
        return;
    }
    
    console.log("User input: " + input);
    
    
    
    var url = "https://en.wikipedia.org/wiki/" + input;

    req(url, function(error, response, body) {
        
        var $ = cheerio.load(body);
        
        if (!error) {

            var firstPar = "" + $("#mw-content-text").find('p').eq(1);
            firstPar = firstPar.replace(/<(?:.|\n)*?>/gm, '');
            console.log(firstPar);
            reply = firstPar;
            if(reply == ""){
                reply = "Try again, we can't determine what " + input + " is.";
                respondToUser(reply);
            }
            respondToUser(reply);
            
        }
    });
    
    response.end();

}).listen(8082);




/*
add data to server so we can upload it to our website
*/
function addDataToFireBase(word) {

    usersRef.child("words").push(word);
};


var restify = require('restify');
var botbuilder = require('botbuilder');
var cognitiveservices = require('botbuilder-cognitiveservices');

// setup restify

var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3990, function() {
    console.log('% bot started at %', server.name, server.url)
});

// create chat connector
var connector = new botbuilder.ChatConnector({
    appId: process.env.APP_ID,
    appPassword: process.env.APP_SECRET
});

// listening inputs
server.post('/api/messages', connector.listen());

// Reply by echoing
var bot = new botbuilder.UniversalBot(connector, function(session) {    
    return session.beginDialog('alarme');    
});
bot.dialog('alarme',require('./dialogs/alarm'));

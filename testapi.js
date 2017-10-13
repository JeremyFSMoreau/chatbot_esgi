var restify = require('restify');
var botbuilder = require('botbuilder');
var cognitiveservices = require('botbuilder-cognitiveservices');

// setup restify  

var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3991, function() {
    console.log('% bot started at %', server.name, server.url)
});

// create chat connector
var connector = new botbuilder.ChatConnector({
    appId: process.env.APP_ID,
    appPassword: process.env.APP_SECRET
});

// listening inputs
server.post('/api/messages', connector.listen());

var bot = new botbuilder.UniversalBot(connector);

var recognizer = new cognitiveservices.QnAMakerRecognizer({
    knowledgeBaseId : '996eabfd-2574-4335-a5aa-f0117eb81237',
    subscriptionKey : 'e168ca31a6f5423ca016a37f03a5d828'
});

var basicQnAMakerDialog = new cognitiveservices.QnAMakerDialog({
    recognizers: [recognizer],
    defaultMessage : "Pas de correspondance",
    qnaThresholf: 0.3
});

bot.dialog('/', basicQnAMakerDialog);
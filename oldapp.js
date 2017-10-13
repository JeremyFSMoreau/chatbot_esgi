var restify = require('restify');
var botbuilder = require('botbuilder');
var cognitiveservices = require('botbuilder-cognitiveservices');

// setup restify 
// setup restify 
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
    //session.send('You have tapped: %s | [Length: %s]', session.message.text, session.message.text.length);
    
    return session.beginDialog('reservations:hotel');
    // session.send(`Vous avez écrit : ${session.message.text}`);
    // bot.on('typing', function(){
    //     session.send("J'ai l'impression que vous essayez de me dire quelque chose...");
    // });
    bot.on('conversationUpdate', function(message){
        if(message.membersAdded && message.membersAdded.length > 0)
        {
            var membersAdded = message.membersAdded
            .map(function(x){
                var isSelf = x.id ==message.address.bot.id;
                return (isSelf ? message.address.bot.name : x.name) || ' ' + '(Id = ' + x.id + ')';
            }).join(', ');
            bot.send(new botbuilder.Message()
                .address(message.address)
                .text('L\'utilisateur ' + membersAdded + ' a rejoint la conversation. Bienvenue ;)'));
        }

        if (message.membersRemoved && message.membersRemoved.length > 0) {
            var membersRemoved = message.membersRemoved
                .map(function (x) {
                    var isSelf = x.id === message.address.bot.id;
                    return (isSelf ? message.address.bot.name : x.name) || '' + ' (Id: ' + x.id + ')';
                }).join(', ');    
            bot.send(new botbuilder.Message()
                .address(message.address)
                .text(membersRemoved + 'a quitté la conversation. A bientôt !'));
        }
    });

    
});

bot.dialog('greetings', [
    function (session) {
        session.send("Bienvenue dans l'interface de réservation du restaurant !");
        botbuilder.Prompts.time(session, "Merci de fournir la date et l'heure de votre réservation");
    },
    function (session, results) {
        session.dialogData.reservationDate = botbuilder.EntityRecognizer.resolveTime([results.response]);
        botbuilder.Prompts.text(session, "Combien de personnes seront conviés à ce repas ?");
    },
    function (session, results) {
        session.dialogData.partySize = results.response;
        botbuilder.Prompts.text(session, "Sous quel nom devons nous valider la réservation ?");
    },
    function (session, results) {
        session.dialogData.reservationName = results.response;

       // Process request and display reservation details
        session.send(`Reservation confirmée. Détails de la réservation: <br/>Jour: ${session.dialogData.reservationDate} <br/>Nombre de personnes: ${session.dialogData.partySize} <br/>Nom de la réservation: ${session.dialogData.reservationName}`);
        session.endDialog();
    }
]);

//bot.dialog('hotel',require('./dialogs/hotel'));
//bot.library(require('./dialogs/reservations'));
bot.dialog('alarme',require('./dialogs/alarm'));

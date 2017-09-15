var restify = require('restify');
var botbuilder = require('botbuilder');

// setup restify 

var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3988, function() {
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
    
    session.send(`Vous avez écrit : ${session.message.text}`);
    bot.on('typing', function(){
        session.send("J'ai l'impression que vous essayez de me dire quelque chose...");
    });
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

    
    

    // session.send(JSON.stringify(session.dialogData));
    // session.send(JSON.stringify(session.sessionState));
    // session.send(JSON.stringify(session.conversationData));
    // session.send(JSON.stringify(session.userData));
});

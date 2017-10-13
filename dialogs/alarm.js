var builder = require('botbuilder');

module.exports = [
    function (session, args, next) {
        if (!session.userData.everyAlarms)
            session.userData.everyAlarms = [];
        builder.Prompts.choice(session, "Bienveue dans la gestion de votre alarme. <br/>Que souhaitez-vous faire ?", "Ajouter une alarme|Lister les alarmes|Historique de mes alarmes", { listStyle: builder.ListStyle.button });
    },
    function (session, results, next) {
        if (results.response.index == 0 ) {
            session.dialogData.newAlarm = {};
            builder.Prompts.text(session, "Indiquez un nom pour l'alarme");
        } 
        else if (results.response.index == 1 ) 
        {
            if(session.userData.everyAlarms.length >=1)
            {
                var message = new builder.Message(session);
                message.attachmentLayout(builder.AttachmentLayout.carousel);
                var richCards = [];
                for (var i = 0; i<session.userData.everyAlarms.length; i++) {
                    var checkDate = Date.parse(session.userData.everyAlarms[i].date);
                    console.log("?????????"+ checkDate);
                    console.log("!!!!!!!!!!!!" + Date.now());
                    if(checkDate > Date.now())
                    {
                        var number = i+1;
                        var richCard =  new builder.HeroCard(session)
                                        .title("Alarme " + number)
                                        .subtitle("Nom : " + session.userData.everyAlarms[i].name)
                                        .text("Jour : " + session.userData.everyAlarms[i].date)
                        richCards.push(richCard)
                    }
                }
                if(richCards.length > 0)
                {
                    message.attachments(richCards);
                    session.send(message).endDialog();
                }
                else
                {
                    session.send("Pas d'alarme");
                }
            }
            else
            {
                session.send("Pas d'alarme");
            }
        }
        else if (results.response.index == 2 ) 
        {
            if(session.userData.everyAlarms.length >=1)
            {
                var message = new builder.Message(session);
                message.attachmentLayout(builder.AttachmentLayout.carousel);
                var richCards = [];
                for (var i = 0; i<session.userData.everyAlarms.length; i++) {
                    var checkDate = Date.parse(session.userData.everyAlarms[i].date);
                    console.log("?????????"+ checkDate);
                    console.log("!!!!!!!!!!!!" + Date.now());
                    if(checkDate < Date.now())
                    {
                        var number = i+1;
                        var richCard =  new builder.HeroCard(session)
                                        .title("Alarme " + number)
                                        .subtitle("Nom : " + session.userData.everyAlarms[i].name)
                                        .text("Jour : " + session.userData.everyAlarms[i].date)
                        richCards.push(richCard)
                    }
                }
                if(richCards.length > 0)
                {
                    message.attachments(richCards);
                    session.send(message).endDialog();
                }
                else
                {
                    session.send("Pas d'alarme");
                }
            }
            else
            {
                session.send("Pas d'alarme");
            }
        }
    },
    function (session, results, next) {
        if (results.response) {
            session.dialogData.newAlarm.name = results.response;
        }
        if (!session.dialogData.newAlarm.date) {
            builder.Prompts.time(session, "Renseignez la date et l'heure du jour auquel vous souhaitez être réveillé (Format : MM/JJ/AAAA HH:MM");
        } else {
            next();
        }
    },
    function (session, results) {
        if (results.response) {
            session.dialogData.newAlarm.date = builder.EntityRecognizer.resolveTime([results.response]);
            session.userData.everyAlarms.push(session.dialogData.newAlarm);
            session.send("L'alarme a bien été enregistrée");
        }
        session.endDialogWithResult({ response: session.dialogData });
    },
    function (session, results) {
        session.dialogData = results.response; 
    }    
]
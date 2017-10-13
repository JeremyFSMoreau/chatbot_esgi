var botbuilder = require('botbuilder');

module.exports = [
    function (session, args, next) {
        session.dialogData.reservation = args || {};
        session.dialogData.reservation.person = args || {};
        session.send("Bienvenue, si vous souhaitez réserver un Hôtel vous êtes à l'endroit qu'il faut !");
        if(!session.dialogData.reservation.person.name){
            botbuilder.Prompts.text(session, "A quel nom dois-je effectuer la réservation ?");
        }
        else{
            next();
        }
    },
    function (session, results, next) {
        session.dialogData.reservation.person.name = results.response;
        if(!session.dialogData.reservation.person.email){
            botbuilder.Prompts.text(session, "Quelle est vodre adresse email ?");
        }
        else{
            next();
        }
    },
    function (session, results, next) {
        session.dialogData.reservation.person.email = results.response;
        if(!session.dialogData.reservation.person.age){
            botbuilder.Prompts.number(session, "Quel âge avez-vous ?");
        }
        else{
            next();
        }
    },
    function (session, results, next) {
        session.dialogData.reservation.person.age = results.response;
        if(!session.dialogData.reservation.destination){
            botbuilder.Prompts.text(session, "Où souhaitez-vous partir ?");
        }
        else{
            next();
        }
    },
    function (session, results, next) {
        session.dialogData.reservation.destination = results.response;
        if(!session.dialogData.reservation.date){
            botbuilder.Prompts.time(session, "A quelle date souhaitez-vous partir ?");
        }
        else{
            next();
        }
    },
    function (session, results, next) {
        session.dialogData.reservation.date = botbuilder.EntityRecognizer.resolveTime([results.response]);
        if(!session.dialogData.reservation.duration){
            botbuilder.Prompts.text(session, "Pour combien de nuits ?");
        }
        else{
            next();
        }
    },
    function (session, results) {
        session.dialogData.reservation.duration = results.response;

       // Process request and display reservation details
        session.send(`Reservation confirmée. Détails de la réservation: <br/>
            Nom: ${session.dialogData.reservation.person.name} <br/>
            Email: ${session.dialogData.reservation.person.email} <br/>
            Age de la personne effectuant la réservation: ${session.dialogData.reservation.person.age} <br/>
            Destination : ${session.dialogData.reservation.destination} <br/>
            Date check-in : ${session.dialogData.reservation.date} <br/>
            Nombre de nuits : ${session.dialogData.reservation.duration}`);
        session.endDialog();
    }
];
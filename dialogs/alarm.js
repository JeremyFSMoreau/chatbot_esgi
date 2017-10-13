var builder = require('botbuilder');

module.exports = [
    function (session, args, next) {
        session.dialogData.alarm = args || {};
        builder.Prompts.choice(session, "Bienveue dans la gestion de votre alarme. <br/>Que souhaitez-vous faire ?", "Ajouter une alarme|Lister les alarmes à venir|Historique de mes alarmes", { listStyle: builder.ListStyle.button });
    },
    function (session, results, next) {
        if (results.response.index == 0 ) {
            //session.dialogData.alarm.name = results.response;
            builder.Prompts.time(session, "What time would you like to set an alarm for?");
        } 
        else if (results.response.index == 1 ) {
            session.send('Les alarmes à venir :');
            next();
        }
        else if (results.response.index == 2 ) {
            session.send('L\'historique des alarmes : ');
            next();
        }
    },
    function (session, results) {
        session.send('test');
    //     session.dialogData.reservation.duration = results.response;

    //    // Process request and display reservation details
    //     session.send(`Reservation confirmée. Détails de la réservation: <br/>
    //         Nom: ${session.dialogData.reservation.person.name} <br/>
    //         Email: ${session.dialogData.reservation.person.email} <br/>
    //         Age de la personne effectuant la réservation: ${session.dialogData.reservation.person.age} <br/>
    //         Destination : ${session.dialogData.reservation.destination} <br/>
    //         Date check-in : ${session.dialogData.reservation.date} <br/>
    //         Nombre de nuits : ${session.dialogData.reservation.duration}`);
         session.endDialog();
    }
];
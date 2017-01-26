/**
 * @author Patrick Pei / github.com/patrickkerrypei
 */

'use strict';

/**
 * App ID for the skill
 */
let APP_ID = "amzn1.ask.skill.b105a9ba-fd34-467e-91b2-e85b2bbbd88d";

/**
 * The AlexaSkill prototype and helper functions
 */
const AlexaSkill = require('./alexaSkill');
const ittfUtils = require('./ittfUtils');

let UnofficialITTF = function () {
    AlexaSkill.call(this, APP_ID);
};

UnofficialITTF.prototype = Object.create(AlexaSkill.prototype);
UnofficialITTF.prototype.constructor = UnofficialITTF;

UnofficialITTF.prototype.eventHandlers.onSessionStarted = (sessionStartedRequest, session) => {
    console.log("UnofficialITTF onSessionStarted requestId: " + sessionStartedRequest.requestId
        + ", sessionId: " + session.sessionId);
};

UnofficialITTF.prototype.eventHandlers.onLaunch = (launchRequest, session, response) => {
    const text = "Welcome to Unofficial ITTF, you can ask me about Men\'s and Women\'s" +
        " table tennis world rankings.";
    const question = "What would you like to know?";

    response.ask(text, question);
};

UnofficialITTF.prototype.eventHandlers.onSessionEnded = (sessionEndedRequest, session) => {
    console.log("UnofficialITTF onSessionEnded requestId: " + sessionEndedRequest.requestId
        + ", sessionId: " + session.sessionId);
};

UnofficialITTF.prototype.intentHandlers = {
    "PlayerRankingIntent": (intent, session, response) => {
        let rank = intent.slots.Rank.value;
        let gender = intent.slots.Gender.value;

        const menKeywords = ['male', 'males', 'men', 'man', 'guys', 'guy'];
        const womenKeywords = ['girl', 'girls', 'lady', 'ladies', 'female', 'females', 'women', 'woman'];
        let genderLetter = menKeywords.indexOf(gender) > -1 ? 'M' : 'W';

        console.log('Received rank: ', rank);
        console.log('Gender letter: ', genderLetter);
        if (rank >= 1 && rank <= 840) {
            ittfUtils.getPlayer(rank, genderLetter)
                .then(name => {
                    // let reply = `The number ${rank} ranked ${gender} is ${name}`;
                    response.tell(name);
                })
                .catch(err => {
                    console.log(err.message);
                });
        } else {
            let reply = 'Please try again with a valid rank';
            response.tell(reply);
        }

    },
    "AMAZON.HelpIntent": (intent, session, response) => {
        const text = "You can ask me who is the number one ranked male";
        const question = "What would you like to know?";

        response.ask(text, question);
    },
    "AMAZON.StopIntent": (intent, session, response) => {
        const text = "Goodbye";

        response.tell(text);
    },
    "AMAZON.CancelIntent": (intent, session, response) => {
        const text = "Goodbye";

        response.tell(text);
    }
};

// Create the handler that responds to the Alexa Request.
exports.handler = (event, context) => {
    try {
        console.log("event.session.application.applicationId=" + event.session.application.applicationId);
        if (event.session.application.applicationId !== "amzn1.ask.skill.b105a9ba-fd34-467e-91b2-e85b2bbbd88d") {
            context.fail("Invalid Application ID");
        }
    } catch (e) {
        console.error(e.message);
    }

    let unofficialITTF = new UnofficialITTF();
    unofficialITTF.execute(event, context);
};

// class UnofficialITTF extends AlexaSkill {
//
//     static intentHandlers = {
//         // register custom intent handlers
//         "UnofficialITTFIntent": function (intent, session, response) {
//             response.tellWithCard("Hello World!", "Hello World", "Hello World!");
//         },
//         "AMAZON.HelpIntent": function (intent, session, response) {
//             response.ask("You can say hello to me!", "You can say hello to me!");
//         }
//     };
//
//     constructor() {
//         AlexaSkill.call(this, APP_ID);
//     }
//
//     onSessionStarted(sessionStartedRequest, session) {
//         console.log("UnofficialITTF onSessionStarted requestId: " + sessionStartedRequest.requestId
//         + ", sessionId: " + session.sessionId);
//         // any initialization logic goes here
//     }
//
//     onLaunch(launchRequest, session, response) {
//         console.log("UnofficialITTF onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
//         var speechOutput = "Welcome to the Alexa Skills Kit, you can say hello";
//         var repromptText = "You can say hello";
//         response.ask(speechOutput, repromptText);
//     }
//
//     onSessionEnded(sessionEndedRequest, session) {
//         console.log("UnofficialITTF onSessionEnded requestId: " + sessionEndedRequest.requestId
//             + ", sessionId: " + session.sessionId);
//         // any cleanup logic goes here
//     }
// }
/**
 Copyright 2014-2015 Amazon.com, Inc. or its affiliates. All Rights Reserved.

 Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at

 http://aws.amazon.com/apache2.0/

 or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

'use strict';

/**
 * This simple sample has no external dependencies or session management, and shows the most basic
 * example of how to create a Lambda function for handling Alexa Skill requests.
 *
 * Examples:
 * One-shot model:
 *  User: "Alexa, tell Hello World to say hello"
 *  Alexa: "Hello World!"
 */

/**
 * App ID for the skill
 */
let APP_ID = undefined; //replace with "amzn1.echo-sdk-ams.app.[your-unique-value-here]";

/**
 * The AlexaSkill prototype and helper functions
 */
const AlexaSkill = require('./alexaSkill');
const ittfUtils = require('./ittfUtils');

let UnofficialITTF = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
UnofficialITTF.prototype = Object.create(AlexaSkill.prototype);
UnofficialITTF.prototype.constructor = UnofficialITTF;

UnofficialITTF.prototype.eventHandlers.onSessionStarted = (sessionStartedRequest, session) => {
    console.log("UnofficialITTF onSessionStarted requestId: " + sessionStartedRequest.requestId
        + ", sessionId: " + session.sessionId);
};

UnofficialITTF.prototype.eventHandlers.onLaunch = (launchRequest, session, response) => {
    let introduction = "Welcome to the Unofficial ITTF Alexa skill, you can ask me about Men\'s and Women\'s" +
        " table tennis world rankings. In the future, I will support more complex queries.";
    response.tell(introduction);
};

UnofficialITTF.prototype.eventHandlers.onSessionEnded = (sessionEndedRequest, session) => {
    console.log("UnofficialITTF onSessionEnded requestId: " + sessionEndedRequest.requestId
        + ", sessionId: " + session.sessionId);
};

UnofficialITTF.prototype.intentHandlers = {
    // register custom intent handlers
    "PlayerRankingIntent": (intent, session, response) => {
        let rank = intent.slots.Rank.value;
        let gender = intent.slots.Gender.value;

        const menKeywords = ['male', 'males', 'men', 'man', 'guys', 'guy'];
        const womenKeywords = ['girl', 'girls', 'lady', 'ladies', 'female', 'females', 'women', 'woman'];
        let genderLetter = menKeywords.indexOf(gender) > -1 ? 'M' : 'W';

        if (rank >= 1 && rank <= 840) {
            ittfUtils.getPlayer(rank, genderLetter)
                .then(name => {
                    let reply = `The number ${rank} ranked ${gender} is ${name}`;
                    response.tell(reply);
                });
        } else {
            let reply = 'Please try again with a valid rank';
            response.tell(reply);
        }

    },
    "AMAZON.HelpIntent": (intent, session, response) => {
        response.ask("You can say hello to me!", "You can say hello to me!");
    }
};

// Create the handler that responds to the Alexa Request.
exports.handler = (event, context) => {
    try {
        console.log("event.session.application.applicationId=" + event.session.application.applicationId);
        /**
         * Uncomment this if statement and populate with your skill's application ID to
         * prevent someone else from configuring a skill that sends requests to this function.
         */
        if (event.session.application.applicationId !== "amzn1.ask.skill.b105a9ba-fd34-467e-91b2-e85b2bbbd88d") {
            context.fail("Invalid Application ID");
        }
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
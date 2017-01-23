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
const AlexaSkill = require('./AlexaSkill');
const $ = require('jquery');

let UnofficialITTF = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
UnofficialITTF.prototype = Object.create(AlexaSkill.prototype);
UnofficialITTF.prototype.constructor = UnofficialITTF;

UnofficialITTF.prototype.eventHandlers.onSessionStarted = (sessionStartedRequest, session) => {
    console.log("UnofficialITTF onSessionStarted requestId: " + sessionStartedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any initialization logic goes here
};

UnofficialITTF.prototype.eventHandlers.onLaunch = (launchRequest, session, response) => {
    let introduction = "Welcome to the Unofficial ITTF Alexa skill, you can ask me about Men\'s and Women\'s table tennis world rankings. " +
        "In the future, I will support more complex queries.";
    response.tell(introduction);
};

UnofficialITTF.prototype.eventHandlers.onSessionEnded = (sessionEndedRequest, session) => {
    console.log("UnofficialITTF onSessionEnded requestId: " + sessionEndedRequest.requestId
        + ", sessionId: " + session.sessionId);
};

UnofficialITTF.prototype.intentHandlers = {
    // register custom intent handlers
    "PlayerRankingIntent": (intent, session, response) => {
        const rank = intent.slots.Rank.value;
        const gender = intent.slots.Gender.value;
        response.tell("Rank: " + rank + " and Gender: " + gender);
    },
    "AMAZON.HelpIntent": (intent, session, response) => {
        response.ask("You can say hello to me!", "You can say hello to me!");
    }
};

// Create the handler that responds to the Alexa Request.
exports.handler = (event, context) =>   {
    // Create an instance of the UnofficialITTF skill.
    var helloWorld = new UnofficialITTF();
    helloWorld.execute(event, context);
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
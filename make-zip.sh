#!/usr/bin/env bash

if [ -f ./ittf-alexa-skill.zip ]; then
    rm ittf-alexa-skill.zip;
fi

zip ittf-alexa-skill.zip -r node_modules alexaSkill.js index.js ittfUtils.js package.json
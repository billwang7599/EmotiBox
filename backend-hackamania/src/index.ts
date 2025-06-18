import {Request, Response } from "express"

const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

// Your Slack bot token (Bot User OAuth Token)
const SLACK_BOT_TOKEN = process.env.SLACK_TOKEN;

app.get("/", async (req: Request, res: Response) => {
    res.send("Healthy")
})

app.post("/slack", async (req: Request, res: Response) => {
    const { type, challenge, event } = req.body;

    // Respond to the Slack challenge request (URL Verification)
    if (type === "url_verification") {
        return res.send({ challenge });
    }

    // Avoid responding to messages from the bot itself
    if (event && event.user && event.type && (event.type === "app_mention" || event.type === "message")) {
        console.log(event);

        // Optional: Ignore bot messages
        if (event.bot_id) {
            return res.sendStatus(200);
        }

        try {
            await axios.post("https://slack.com/api/chat.postMessage", {
                channel: event.channel,
                text: "cool"
            }, {
                headers: {
                    Authorization: `Bearer ${SLACK_BOT_TOKEN}`,
                    "Content-Type": "application/json"
                }
            });
        } catch (e) {
            console.error(e);
        }
    }

    // Respond quickly to Slack with 200 OK
    res.sendStatus(200);
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Slack bot listening on port ${PORT}`));
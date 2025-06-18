import {Request, Response } from "express"
import { WebClient } from "@slack/web-api";

const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

// Your Slack bot token (Bot User OAuth Token)
const SLACK_BOT_TOKEN = process.env.SLACK_TOKEN;

const slackClient = new WebClient(SLACK_BOT_TOKEN);

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

app.post("/slack/commands", async (req: Request, res: Response) => {
    const channelId = req.body.channel_id;
    const userId = req.body.user_id;

    try {
        // Fetch the latest 100 messages from the channel
        const history = await slackClient.conversations.history({
            channel: channelId,
            limit: 100,
        });

        // Example: Just count messages and reply to user
        res.json({
            response_type: "ephemeral",
            text: `Fetched ${history.messages?.length ?? 0} messages from this channel.`,
        });

        // TODO: Store or process the logs as needed
        // Example: Log to console
        if (history.messages) {
            history.messages.forEach(msg =>
                console.log(`[${channelId}] ${msg.user}: ${msg.text}`)
            );
        }
    } catch (error) {
        console.error(error);
        res.json({
            response_type: "ephemeral",
            text: "Failed to fetch chat history.",
        });
    }
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Slack bot listening on port ${PORT}`));
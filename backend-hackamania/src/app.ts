import { Request, Response } from "express";
import { WebClient } from "@slack/web-api";

const express = require("express");
const bodyParser = require("body-parser");
require('dotenv').config();

const app = express();

// For regular API/event routes
app.use(bodyParser.json());
// For Slack slash commands, which are sent as application/x-www-form-urlencoded
app.use('/slack/commands', bodyParser.urlencoded({ extended: true }));

// Slack bot token (Bot User OAuth Token)
const SLACK_BOT_TOKEN = process.env.SLACK_TOKEN;
const slackClient = new WebClient(SLACK_BOT_TOKEN);

// Health check endpoint
app.get("/", (req: Request, res: Response) => {
    res.send("Healthy");
});

// Slack Events API endpoint (for event subscriptions and mentions)
app.post("/slack", async (req: Request, res: Response) => {
    const { type, challenge, event } = req.body;

    // Respond to Slack's URL verification challenge
    if (type === "url_verification") {
        return res.send({ challenge });
    }

    if (
        event &&
        event.user &&
        event.type &&
        (event.type === "app_mention" || event.type === "message")
    ) {
        if (event.bot_id) {
            return res.sendStatus(200);
        }

        try {
            await slackClient.chat.postMessage({
                channel: event.channel,
                text: "cool",
            });
        } catch (e) {
            console.error(e);
        }
    }

    res.sendStatus(200);
});

// Slack Slash Command endpoint
app.post("/slack/commands", async (req: Request, res: Response) => {
    // Immediately acknowledge the request to avoid dispatch_failed errors:
    res.status(200).send(""); // Empty body = ephemeral message handled async

    const channelId = req.body.channel_id;
    const userId = req.body.user_id;

    try {
        // Fetch the latest 100 messages from the channel
        const history = await slackClient.conversations.history({
            channel: channelId,
            limit: 100,
        });

        // Optional: Log to backend
        if (history.messages) {
            history.messages.forEach(msg =>
                console.log(`[${channelId}] ${msg.user}: ${msg.text}`)
            );
        }

        // Send results as follow-up message in the channel (visible to user)
        await slackClient.chat.postMessage({
            channel: channelId,
            text: `<@${userId}> Requested chat history: found ${history.messages?.length ?? 0} messages.`,
        });
    } catch (error) {
        console.error(error);
        // Follow up with error message
        await slackClient.chat.postMessage({
            channel: channelId,
            text: `<@${userId}> Sorry, I couldn't fetch chat history.`,
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Slack bot listening on port ${PORT}`));
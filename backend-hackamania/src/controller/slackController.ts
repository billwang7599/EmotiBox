import {Request, Response} from "express";
import { handleMessageEvent, getAndReportChatHistory, createUserService, changeLeaderService, getMessagesService } from "../service/slackService";
import axios from 'axios';

export const slackWebhook = async (req: Request, res: Response) => {
  const { type, challenge, event } = req.body;

  if (type === "url_verification") {
    return res.send({ challenge });
  }

  try {
    if (event.type === "message"){
        if (event.bot_id) return;
        await handleMessageEvent(event.user, event.text);
    }
  } catch (e) {
    console.error(e);
    // Optionally: return a 500 status here
  }

  res.sendStatus(200);
};

export const slackSlashGetHistory = async (req: Request, res:Response) => {
    res.status(200).send(""); // Immediate acknowledgment

    const channelId = req.body.channel_id;
    const userId = req.body.user_id;

    try {
        // Supply your slackClient here if it's not in the req
        await getAndReportChatHistory(channelId, userId);
    } catch (e) {
        // Logging already handled in service
    }
}

export const createUser = async (req: Request, res:Response) => {
  const { user_id, text } = req.body;
  const mentionedHandle = text.trim(); // e.g., "@lilyliu438"
  const data = await createUserService(user_id, mentionedHandle);
  return res.json(data);
}

export const changeLeader = async (req: Request, res:Response) => {
  const { user_id, text } = req.body;
  const mentionedHandle = text.trim(); // e.g., "@lilyliu438"
  if (!mentionedHandle) {
    return res.json({
        response_type: 'ephemeral',
        text: `Must provide a team leader!`,
    })
  }
  const data = await changeLeaderService(user_id, mentionedHandle);
  return res.json(data);
}


export const getMessages = async (req: Request, res: Response) => {
  const { user_id, text, channel_id, response_url } = req.body;

  if (!(text === "day" || text === "week" || text === "month")) {
    return res.json({
      response_type: 'ephemeral',
      text: `Must provide either "day", "week", or "month"!`,
    });
  }

  // 1. Respond immediately to Slack to avoid timeout
  res.json({
    response_type: 'ephemeral',
    text: `Processing your summary results for the past ${text} ...`,
  });

  // 2. Do heavy work and send the result via response_url
  try {
    const payload = await getMessagesService(user_id, text, channel_id);

    // Post the formatted result back to Slack using the response_url
    await axios.post(response_url, payload);
  } catch (error) {
    // Optionally notify the user if something goes wrong
    if (response_url) {
      await axios.post(response_url, {
        response_type: 'ephemeral',
        text: "Sorry, something went wrong while processing your request.",
      });
    }
    console.error(error);
  }
};
import { Request, Response } from "express";
import prisma from "./data/client"
import { slackWebhook, slackSlashGetHistory, createUser, changeLeader, getMessages } from "./controller/slackController";
import { analyzeMessage, summarizeMessages, Message } from "./util/agentApi";

const express = require("express");
const bodyParser = require("body-parser");

const app = express();

// For regular API/event routes
app.use(bodyParser.json());
// For Slack slash commands, which are sent as application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true })); // to parse Slack's form body


// Slack bot token (Bot User OAuth Token)

// Health check endpoint
app.get("/", (req: Request, res: Response) => {
    res.send("Healthy");
});

// Slack Events API endpoint (for event subscriptions and mentions)
app.post("/slack", async (req: Request, res: Response) => {
  await slackWebhook(req, res);
});

// Slack Slash Command endpoint
app.post("/slack/getChannelHistory", async (req: Request, res: Response) => {
  await slackSlashGetHistory(req, res);
});

app.post('/slack/createUser', async (req: Request, res: Response) => {
  await createUser(req, res);
});

app.post('/slack/changeLead', async (req: Request, res: Response) => {
  await changeLeader(req, res);
});

app.post('/slack/getMessages', async (req: Request, res: Response) => {
  await getMessages(req, res);
});

app.post('/test/a', async (req: Request, res: Response) => {
  const data = await analyzeMessage("meow");
  res.json(data)
});

app.post('/test/b', async (req: Request, res: Response) => {
  const payload: Message[] = [
  {
    message: "i hate my workplace",
    happiness: 0.1,
    frustration: 0.9,
    tiredness: 0.6,
    sadness: 0.3
  },
  {
    message: "I'm really proud of the work I did today.",
    happiness: 0.9,
    frustration: 0.1,
    tiredness: 0.2,
    sadness: 0.1
  },
  {
    message: "I feel burned out after all these meetings.",
    happiness: 0.3,
    frustration: 0.6,
    tiredness: 0.9,
    sadness: 0.5
  },
  {
    message: "My team was so helpful during the project.",
    happiness: 0.8,
    frustration: 0.2,
    tiredness: 0.4,
    sadness: 0.1
  },
  {
    message: "I don't feel like my ideas are being heard.",
    happiness: 0.2,
    frustration: 0.7,
    tiredness: 0.5,
    sadness: 0.7
  },
  {
    message: "Excited to start the new initiative next week!",
    happiness: 0.95,
    frustration: 0.05,
    tiredness: 0.2,
    sadness: 0.05
  },
  {
    message: "It's hard to concentrate with all the distractions.",
    happiness: 0.2,
    frustration: 0.6,
    tiredness: 0.7,
    sadness: 0.3
  },
  {
    message: "Today was an average day at work.",
    happiness: 0.5,
    frustration: 0.3,
    tiredness: 0.4,
    sadness: 0.3
  }
];
  const data = await summarizeMessages(payload);
  res.json(data);
});


process.on('SIGINT', async () => {
  console.log('SIGINT received. Disconnecting Prisma...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('SIGTERM received. Disconnecting Prisma...');
  await prisma.$disconnect();
  process.exit(0);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Slack bot listening on port ${PORT}`));




// {
//     message: summary of all the messages,
//     happiness: 0.1,
//     frustration: 0.9,
//     tiredness: 0.6,
//     sadness: 0.3
//   },
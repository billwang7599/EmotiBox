import { WebClient } from "@slack/web-api";
import { SLACK_BOT_TOKEN } from "../constants";
export const slackClient = new WebClient(SLACK_BOT_TOKEN);
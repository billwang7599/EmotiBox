import { slackClient } from "./slackClient";

export const fetchChannelHistory = async (channelId: string, limit = 100) => {
    try {
        return await slackClient.conversations.history({
            channel: channelId,
            limit
        });
    } catch (error) {
        throw error;
    }
};

export const postChannelMessage = async (channelId: string, text: string) => {
    try {
        return await slackClient.chat.postMessage({
            channel: channelId,
            text
        });
    } catch (error) {
        throw error;
    }
};

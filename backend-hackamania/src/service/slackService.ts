import { fetchChannelHistory, postChannelMessage } from "../data/slackData";
import { findUserIdByHandle } from "../util/findUser";
import { createUser, changeTeamLead, createMessage, getMessages } from "../data/prismaData";
import { analyzeMessage, summarizeMessages } from "../util/agentApi";

export const getMessagesService = async (userId: string, time: "day" | "week" | "month", channelId: string) => { 
    try {
        const messages = await getMessages(userId, time);
        if (messages.length === 0) {
            return {
                response_type: 'ephemeral',
                text: "Your team members have no registered message!",
            }
        }
        const res = await summarizeMessages(messages);
        console.log(res)
        return {
            response_type: 'ephemeral',
            text: `Average happiness: ${res.scores.happiness * 100}% \n Average tiredness: ${res.scores.tiredness * 100}% \n Average sadness: ${res.scores.sadness* 100}% \n Average frustration: ${res.scores.frustration * 100}% \n Note: ${res.summary}`,

        }    
    } catch (error: any) {
        return {
            response_type: 'ephemeral',
            text: error.message || String(error),

        }
    }
}

export const changeLeaderService = async (userId: string, leaderHandle: string) => {
    try{
        const leaderId = await findUserIdByHandle(leaderHandle);
        await changeTeamLead(userId, leaderId);
        return {
            response_type: 'ephemeral',
            text: `You have changed your leader!`,
        }
    } catch (error: any) {
        return {
            response_type: 'ephemeral',
            text: error.message || String(error),

        }
    }
}

export const createUserService = async (userId: string, leaderHandle?: string) => {
    try{
        if (leaderHandle) {
            const leaderId = await findUserIdByHandle(leaderHandle);
            await createUser(userId, leaderId);
            return {
                response_type: 'ephemeral',
                text: `You are registered with a leader!`,
            }
        }

        await createUser(userId);
        return {
            response_type: 'ephemeral',
            text: `You are registered without a leader!`,
        }

    } catch (error: any) {
        return {
            response_type: 'ephemeral',
            text: error.message || String(error),
        }
    }
}

export const handleMessageEvent = async (userId: string, message: string) => {
    try {
        const res = await analyzeMessage(message);
        if (res.neutral >= 0.45) return
        await createMessage(
            message,
            userId,
            res.happiness,   // happiness
            res.sadness,   // sadness
            res.frustration,   // frustration
            res.tiredness    // tiredness
        );
        return {}
    } catch (error: any) {
        return {
            response_type: 'ephemeral',
            text: error.message || String(error),
        }
    }
};

export const getAndReportChatHistory = async (channelId: string, userId: string) => {
    try {
        // Fetch chat history using Data Layer
        const history = await fetchChannelHistory(channelId, 100);

        // Log messages (optional, could be pulled out)
        if (history.messages) {
            history.messages.forEach(msg => 
                console.log(`[${channelId}] ${msg.user}: ${msg.text}`)
            );
        }

        // Notify user in channel
        await postChannelMessage(
            channelId,
            `<@${userId}> Requested chat history: found ${history.messages?.length ?? 0} messages.`
        );

        return history;
    } catch (error) {
        console.error(error);
        // Notify error
        await postChannelMessage(
            channelId,
            `<@${userId}> Sorry, I couldn't fetch chat history.`
        );
        throw error;
    }
};
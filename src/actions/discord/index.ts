import sendMessage from "./sendMessage";

export const DiscordActions = { sendMessage };

export type TDiscordMessage = {
  id: string;
  type: number;
  channelId: string;
  content: string;
  timestamp: string;
  author: {
    id: string;
    username: string;
    avatar: string;
  };
};

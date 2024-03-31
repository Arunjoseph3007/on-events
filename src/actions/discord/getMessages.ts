import axios from "axios";
import type { TDiscordMessage } from ".";

export default async function getMessages(
  channelId: string
): Promise<Array<TDiscordMessage>> {
  const { data } = await axios.get(
    `https://discord.com/api/v6//channels/${channelId}/messages`,
    {
      headers: {
        Authorization: "Bot " + process.env.DISCORD_BOT_TOKEN,
      },
    }
  );

  return (data as any[]).map((elm) => ({
    id: elm.id,
    type: elm.type,
    channelId,
    content: elm.content,
    timestamp: elm.timestamp,
    author: {
      id: elm.author.id,
      username: elm.author.username,
      avatar: elm.author.avatar,
    },
  }));
}

import axios from "axios";

export default async function sendMessage(channelId: string, content: string) {
  try {
    const res = await axios.post(
      `https://discord.com/api/v6//channels/${channelId}/messages`,
      { content },
      {
        headers: {
          Authorization: "Bot " + process.env.DISCORD_BOT_TOKEN,
        },
      }
    );

    return res.data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

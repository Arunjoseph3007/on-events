import axios from "axios";
import { TAction } from "../../types/Action";

const sendMessage: TAction<string> = async (node, content) => {
  try {
    const res = await axios.post(
      `https://discord.com/api/v6//channels/${node.resourceId}/messages`,
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
};

export default sendMessage;

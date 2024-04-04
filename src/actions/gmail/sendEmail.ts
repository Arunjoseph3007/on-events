import axios from "axios";
import type { TSendEmailConfig } from ".";
import { TAction } from "../../types/Action";

const toRawEmailContent = (config: TSendEmailConfig) =>
  btoa(`From: ${config.from}
To: ${config.to}
Subject: ${config.subject}

${config.content}`);

const sendEmail: TAction<TSendEmailConfig> = async (node, config) => {
  try {
    const { data: accessData } = await axios.post(
      "https://oauth2.googleapis.com/token",
      {
        refresh_token: node.credential?.accessToken,
        client_id: process.env.GOOGLE_OAUTH_CLIENT_ID,
        client_secret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
        grant_type: "refresh_token",
      }
    );

    const { data } = await axios.post(
      `https://gmail.googleapis.com/gmail/v1/users/${config.to}/messages/send`,
      { raw: toRawEmailContent(config) },
      { headers: { Authorization: "Bearer " + accessData.access_token } }
    );
  } catch (error) {
    console.log((error as any).response.data);
  }
};

export default sendEmail;

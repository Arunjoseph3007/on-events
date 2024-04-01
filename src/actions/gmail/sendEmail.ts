import axios from "axios";
import type { TSendEmailConfig } from ".";

const toRawEmailContent = (config: TSendEmailConfig) =>
  btoa(`From: ${config.from}
To: ${config.to}
Subject: ${config.subject}

${config.content}`);

export default async function sendEmail(config: TSendEmailConfig) {
  try {
    const { data: accessData } = await axios.post(
      "https://oauth2.googleapis.com/token",
      {
        refresh_token: process.env.GMAIL_REFRESH_TOKEN,
        client_id: process.env.GSHEET_OAUTH_CLIENT_ID,
        client_secret: process.env.GSHEET_OAUTH_CLIENT_SECRET,
        grant_type: "refresh_token",
      }
    );

    console.log(accessData);

    const { data } = await axios.post(
      `https://gmail.googleapis.com/gmail/v1/users/${config.to}/messages/send`,
      { raw: toRawEmailContent(config) },
      { headers: { Authorization: "Bearer " + accessData.access_token } }
    );
  } catch (error) {
    console.log((error as any).response.data);
  }
}

import axios from "axios";

// This will be very IMPORTANT in future
// Used to get refresh token from code obtained from consent screen
const a = async () => {
  const { data } = await axios.post(
    "https://oauth2.googleapis.com/token",
    {},
    {
      params: {
        code: process.env.GMAIL_REFRESH_TOKEN,
        client_id: process.env.GSHEET_OAUTH_CLIENT_ID,
        client_secret: process.env.GSHEET_OAUTH_CLIENT_SECRET,
        redirect_uri: "https://on-events.vercel.app",
        grant_type: "authorization_code",
      },
    }
  );

  console.log(data);
};

export default async function sendEmail(to: string, content: string) {
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
      `https://gmail.googleapis.com/gmail/v1/users/${to}/messages/send`,
      { raw: btoa(content) },
      { headers: { Authorization: "Bearer " + accessData.access_token } }
    );
  } catch (error) {
    console.log((error as any).response.data);
  }
}

// sendEmail(
//   "arunjoseph3007@gmail.com",
//   `From: arunjoseph3007@gmail.com
// To: arunjoseph3007@gmail.com
// Subject: This is from my app

// Hey this message was sent from on events app using automation`
// );

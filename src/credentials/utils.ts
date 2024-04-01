import axios from "axios";

// Used to get refresh token from code obtained from consent screen
export const grantRefreshToken = async (accessCode: string) => {
  const { data } = await axios.post(
    "https://oauth2.googleapis.com/token",
    {},
    {
      params: {
        code: accessCode,
        client_id: process.env.GSHEET_OAUTH_CLIENT_ID,
        client_secret: process.env.GSHEET_OAUTH_CLIENT_SECRET,
        redirect_uri: "https://on-events.vercel.app",
        grant_type: "authorization_code",
      },
    }
  );

  return data.access_token as string;
};

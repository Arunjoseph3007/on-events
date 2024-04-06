import axios from "axios";
import { TCredentialType } from "../db/schema";

export const isGoogleCred = (type: TCredentialType) => {
  const GoogleCredPrefixes = ["gmail:", "gcalender:", "gsheet"];

  return GoogleCredPrefixes.some((prefix) => type.startsWith(prefix));
};

// Used to get refresh token from code obtained from consent screen
export const googleGrantRefreshToken = async (accessCode: string) => {
  const { data } = await axios.post(
    "https://oauth2.googleapis.com/token",
    {},
    {
      params: {
        code: accessCode,
        client_id: process.env.GOOGLE_OAUTH_CLIENT_ID,
        client_secret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
        redirect_uri: "https://on-events.vercel.app",
        grant_type: "authorization_code",
      },
    }
  );

  return data.refresh_token as string;
};

export const googleGrantAccessToken = async (refreshToken: string) => {
  const { data } = await axios.post("https://oauth2.googleapis.com/token", {
    refresh_token: refreshToken,
    client_id: process.env.GOOGLE_OAUTH_CLIENT_ID,
    client_secret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
    grant_type: "refresh_token",
  });

  return data.access_token as string;
};

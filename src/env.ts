import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string(),
  DISCORD_BOT_TOKEN: z.string(),
  GOOGLE_OAUTH_CLIENT_ID: z.string(),
  GOOGLE_OAUTH_CLIENT_SECRET: z.string(),
  ACTION: z.string(),
  JWT_SECRET_KEY: z.string(),
  CRON_SECRET: z.string(),
  GMAIL_APP_PASSWORD: z.string(),
});

function parseEnv() {
  try {
    envSchema.parse(process.env);
    console.log("Environment variables parsed successfully");
  } catch (error) {
    console.error(
      "Following error occured when parsing environment variables",
      error
    );
    process.exit(1);
  }
}

parseEnv();

type TEnv = z.infer<typeof envSchema>;

declare global {
  type TODO = any;

  namespace NodeJS {
    interface ProcessEnv extends TEnv {}
  }
}

export {};

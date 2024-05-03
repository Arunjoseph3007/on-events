export {};

const envKeys = [
  "DATABASE_URL",
  "DISCORD_BOT_TOKEN",
  "GOOGLE_OAUTH_CLIENT_ID",
  "GOOGLE_OAUTH_CLIENT_SECRET",
  "ACTION",
  "JWT_SECRET_KEY",
  "CRON_SECRET",
] as const;

type TEnv = Record<(typeof envKeys)[number], string>;

declare global {
  type TODO = any;

  namespace NodeJS {
    interface ProcessEnv extends TEnv {}
  }
}

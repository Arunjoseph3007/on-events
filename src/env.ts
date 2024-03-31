export {};

const envKeys = [
  "GITHUB_PAT",
  "DATABASE_URL",
  "DISCORD_BOT_TOKEN",
  "GSHEETS_API_KEY",
  "GSHEET_OAUTH_CLIENT_ID",
  "GSHEET_OAUTH_CLIENT_SECRET",
] as const;

type TEnv = Record<(typeof envKeys)[number], string>;

declare global {
  type TODO = any;

  namespace NodeJS {
    interface ProcessEnv extends TEnv {}
  }
}

export {};

type TEnv = {
  GITHUB_PAT: string;
  DATABASE_URL: string;
  DISCORD_BOT_TOKEN: string;
};

declare global {
  type TODO = any;

  namespace NodeJS {
    interface ProcessEnv extends TEnv {}
  }
}

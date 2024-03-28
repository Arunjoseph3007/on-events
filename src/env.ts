export {};

type TEnv = {
  GITHUB_API: string;
  DATABASE_URL: string;
};

declare global {
  type TODO = any;

  namespace NodeJS {
    interface ProcessEnv extends TEnv {}
  }
}

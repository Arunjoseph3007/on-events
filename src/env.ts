export {};

type TEnv = {
  GITHUB_API: string;
  DATABASE_URL: string;
};

declare global {
  namespace NodeJS {
    interface ProcessEnv extends TEnv {}
  }
}

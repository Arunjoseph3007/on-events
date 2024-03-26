export {};

type TEnv = {
  GITHUB_API: string;
  PORT: string;
};

declare global {
  namespace NodeJS {
    interface ProcessEnv extends TEnv {}
  }
}

export {};

type TEnv = {
  GITHUB_API: string;
};

declare global {
  namespace NodeJS {
    interface ProcessEnv extends TEnv {}
  }
}

import type { TWorkflow } from "../db/schema";

export type TPollingController = {
  dataDepulicationKeyPath: string;
  poll: (workflow: TWorkflow) => Promise<any>;
};

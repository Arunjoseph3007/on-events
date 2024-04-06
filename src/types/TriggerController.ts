import type { Request } from "express";
import type { TWorkflow } from "../db/schema";

export type TTriggerController = {
  register: (p: TWorkflow) => Promise<any>;
  delete: (p: TWorkflow) => Promise<any>;
  handle: (p: Request) => Promise<any>;
};

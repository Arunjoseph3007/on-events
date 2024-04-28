import type { TCredentialType, TNode, TWorkflow } from "../../src/db/schema";

export type TNodeData = {
  readonly data: TWorkflow | TNode;
  type: TCredentialType;
  isLast: boolean;
};

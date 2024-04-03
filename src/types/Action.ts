import type { TCredential, TNode } from "../db/schema";

export type TAction<Payload = any, Response = void> = (
  node: TNode & { credential: TCredential | null },
  payload: Payload
) => Promise<Response>;

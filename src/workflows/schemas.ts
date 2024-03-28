import { z } from "zod";
import { eventTypeEnum, nodeTypeEnum } from "../db/schema";

export const insertWorkflowSchema = z.object({
  name: z.string().max(256),
  nodes: z
    .array(
      z.object({
        nodeType: z.enum(nodeTypeEnum.enumValues),
        eventType: z.enum(eventTypeEnum.enumValues),
      })
    )
    .min(1)
    .max(10),
});

import { z } from "zod";
import { eventTypeEnum, triggerTypeEnum } from "../db/schema";

export const insertWorkflowSchema = z.object({
  name: z.string().max(256),
  triggerType: z.enum(triggerTypeEnum.enumValues),
  triggerCredentialId: z.number().optional(),
  resourceId: z.string(),
  nodes: z
    .array(
      z.object({
        eventType: z.enum(eventTypeEnum.enumValues),
        credentialId: z.number().optional(),
        resourceId: z.string(),
        config: z.any(),
        internalId: z.number(),
        parentNodeId: z.number().optional(),
      })
    )
    .min(1)
    .max(10),
});

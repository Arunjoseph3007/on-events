import { z } from "zod";
import { eventTypeEnum, triggerTypeEnum } from "../db/schema";

export const insertWorkflowSchema = z.object({
  name: z.string().max(256),
  triggerType: z.enum(triggerTypeEnum.enumValues),
  nodes: z
    .array(
      z.object({
        eventType: z.enum(eventTypeEnum.enumValues),
      })
    )
    .min(1)
    .max(10),
});

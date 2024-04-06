import { z } from "zod";
import { credentialTypeEnum } from "../db/schema";

export const insertCredentialsSchema = z.object({
  clientId: z.string().optional(),
  accessToken: z.string(),
  expiry: z.date().optional(),
  credentialType: z.enum(credentialTypeEnum.enumValues),
});

export const credTypeSchema = z.enum(credentialTypeEnum.enumValues);

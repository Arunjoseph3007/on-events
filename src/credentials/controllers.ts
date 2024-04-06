import type * as z from "zod";
import { insertCredentialsSchema } from "./schema";
import db from "../db";
import { TCredentialType, credentials } from "../db/schema";
import { and, eq } from "drizzle-orm";
import { grantRefreshToken } from "./utils";

async function create(
  payload: z.infer<typeof insertCredentialsSchema>,
  userId: number
) {
  if (
    payload.credentialType.startsWith("gmail:") ||
    payload.credentialType.startsWith("gsheet:")
  ) {
    payload.accessToken = await grantRefreshToken(payload.accessToken);
  }

  const created = await db
    .insert(credentials)
    .values({ ...payload, userId })
    .returning();

  return created[0];
}

async function getCredentialsByUserId(userId: number) {
  const creds = await db
    .select()
    .from(credentials)
    .where(eq(credentials.userId, userId));

  return creds;
}

async function getCredentialsOfType(type: TCredentialType, userId: number) {
  const creds = await db
    .select()
    .from(credentials)
    .where(
      and(
        eq(credentials.userId, userId), 
        eq(credentials.credentialType, type)
      )
    );

  return creds;
}

async function getCredentialsById(id: number) {
  const cred = await db.query.credentials.findFirst({
    where: eq(credentials.id, id),
  });

  return cred;
}

async function deleteCred(id: number) {
  return await db.delete(credentials).where(eq(credentials.id, id)).returning();
}

export const CredentialsController = {
  create,
  getCredentialsByUserId,
  getCredentialsById,
  delete: deleteCred,
  getCredentialsOfType,
};

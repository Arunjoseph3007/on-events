import type * as z from "zod";
import { insertCredentialsSchema } from "./schema";
import db from "../db";
import { credentials } from "../db/schema";
import { eq } from "drizzle-orm";

async function create(
  payload: z.infer<typeof insertCredentialsSchema>,
  userId: number
) {
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

async function getCredentialsById(id: number) {
  const cred = await db.query.credentials.findFirst({
    where: eq(credentials.id, id),
  });

  return cred;
}

async function deleteCred(credentialId: number) {}

export const CredentialsController = {
  create,
  getCredentialsByUserId,
  getCredentialsById,
  delete: deleteCred,
};
import type * as z from "zod";
import { insertCredentialsSchema } from "./schema";
import db from "../db";
import { credentials } from "../db/schema";
import { eq } from "drizzle-orm";
import { googleGrantRefreshToken, isGoogleCred } from "./utils";

async function create(
  payload: z.infer<typeof insertCredentialsSchema>,
  userId: number
) {
  if (isGoogleCred(payload.credentialType)) {
    payload.accessToken = await googleGrantRefreshToken(payload.accessToken);
  }

  const created = await db
    .insert(credentials)
    .values({ ...payload, userId })
    .returning();

  return created[0];
}

async function getCredentialsById(id: number) {
  const cred = await db.query.credentials.findFirst({
    where: eq(credentials.id, id),
    columns: { accessToken: false },
  });

  return cred;
}

async function deleteCred(id: number) {
  return await db.delete(credentials).where(eq(credentials.id, id)).returning();
}

export const CredentialsController = {
  create,
  getCredentialsById,
  delete: deleteCred,
};

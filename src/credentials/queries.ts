import { and, eq } from "drizzle-orm";
import db from "../db";
import { TCredentialType, credentials } from "../db/schema";

function credentialsByUserId(userId: number) {
  return db
    .select()
    .from(credentials)
    .where(eq(credentials.userId, userId))
    .$dynamic();
}

function credentialsOfType(type: TCredentialType, userId: number) {
  return db
    .select()
    .from(credentials)
    .where(
      and(eq(credentials.userId, userId), eq(credentials.credentialType, type))
    )
    .$dynamic();
}

export const CredentialQuery = {
  credentialsByUserId,
  credentialsOfType,
};

import { and, eq, getTableColumns } from "drizzle-orm";
import db from "../db";
import { TCredentialType, credentials } from "../db/schema";

const { accessToken, ...CredentialPublicFeilds } = getTableColumns(credentials);

function credentialsByUserId(userId: number) {
  return db
    .select(CredentialPublicFeilds)
    .from(credentials)
    .where(eq(credentials.userId, userId))
    .$dynamic();
}

function credentialsOfType(type: TCredentialType, userId: number) {
  return db
    .select(CredentialPublicFeilds)
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

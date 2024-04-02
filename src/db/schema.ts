import { InferSelectModel, relations } from "drizzle-orm";
import {
  pgTable,
  serial,
  text,
  varchar,
  timestamp,
  boolean,
  integer,
  pgEnum,
} from "drizzle-orm/pg-core";

export const triggerTypeEnum = pgEnum("triggerTypeEnum", [
  "github:commit-received",
  "gmail:mail-received",
]);

export const eventTypeEnum = pgEnum("eventTypeEnum", [
  "gmail:send-mail",
  "gsheet:append-row",
  "discord:send-message",
]);

export const credentialTypeEnum = pgEnum("credentialTypeEnum", [
  ...triggerTypeEnum.enumValues,
  ...eventTypeEnum.enumValues,
]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  email: varchar("email", { length: 256 }).unique().notNull(),
});

export const userRelation = relations(users, ({ many }) => ({
  workflows: many(workflows),
  credentials: many(credentials),
}));

export const workflows = pgTable("workflows", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  triggerType: triggerTypeEnum("trigger_type").notNull(),
  triggerCredentialId: integer("trigger_credential_id").references(
    () => credentials.id
  ),
  // webHookId: varchar("webhook_id", { length: 256 }),
  // usePolling: boolean("use_polling").default(false).notNull(),
  // pollingUrl: varchar("polling_url", { length: 265 }),
});

export const workflowRelations = relations(workflows, ({ one, many }) => ({
  triggerCredential: one(credentials, {
    fields: [workflows.triggerCredentialId],
    references: [credentials.id],
  }),
  creator: one(users, {
    fields: [workflows.userId],
    references: [users.id],
  }),
  nodes: many(nodes),
}));

export const nodes = pgTable("nodes", {
  id: serial("id").primaryKey(),
  workflowId: integer("workflow_id")
    .references(() => workflows.id)
    .notNull(),
  eventType: eventTypeEnum("event_type").notNull(),
  parentNodeId: integer("parent_node_id"),
  credentialId: integer("credential_id").references(() => credentials.id),
});

export const nodeParentRelation = relations(nodes, ({ one }) => ({
  parent: one(nodes, {
    fields: [nodes.parentNodeId],
    references: [nodes.id],
  }),
  workflow: one(workflows, {
    fields: [nodes.workflowId],
    references: [workflows.id],
  }),
  credential: one(credentials, {
    fields: [nodes.credentialId],
    references: [credentials.id],
  }),
}));

export const credentials = pgTable("credentials", {
  id: serial("id").primaryKey(),
  clientId: varchar("client_id", { length: 256 }),
  accessToken: text("access_token").notNull(),
  expiry: timestamp("expiry"),
  credentialType: credentialTypeEnum("credential_type").notNull(),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
});

export const credentialsRelations = relations(credentials, ({ many, one }) => ({
  workflows: many(workflows),
  nodes: many(nodes),
  owner: one(users, {
    fields: [credentials.userId],
    references: [users.id],
  }),
}));

// Types
export type TWorkflow = InferSelectModel<typeof workflows>;
export type TUser = InferSelectModel<typeof users>;
export type TNode = InferSelectModel<typeof nodes>;
export type TCredential = InferSelectModel<typeof credentials>;

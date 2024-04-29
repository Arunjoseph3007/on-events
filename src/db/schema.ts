import { InferSelectModel, relations } from "drizzle-orm";
import {
  pgTable,
  serial,
  text,
  varchar,
  timestamp,
  boolean,
  integer,
  json,
  pgEnum,
} from "drizzle-orm/pg-core";
import {
  CredentialTypeValues,
  EventTypeValues,
  TriggerTypeValues,
} from "../../common/schema";

export const triggerTypeEnum = pgEnum("triggerTypeEnum", TriggerTypeValues);

export const eventTypeEnum = pgEnum("eventTypeEnum", EventTypeValues);

export const credentialTypeEnum = pgEnum(
  "credentialTypeEnum",
  CredentialTypeValues
);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  email: varchar("email", { length: 256 }).unique().notNull(),
  passwordHash: text("password_hash").notNull(),
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
  resourceId: text("resource_id").notNull(),
  webHookId: varchar("webhook_id", { length: 256 }),
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
  internalId: integer("internal_id").notNull(),
  workflowId: integer("workflow_id")
    .references(() => workflows.id)
    .notNull(),
  eventType: eventTypeEnum("event_type").notNull(),
  parentNodeId: integer("parent_node_id"),
  credentialId: integer("credential_id").references(() => credentials.id),
  resourceId: text("resource_id").notNull(),
  config: json("config"),
});

export const nodeParentRelation = relations(nodes, ({ one }) => ({
  parent: one(nodes, {
    fields: [nodes.parentNodeId],
    references: [nodes.internalId],
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
  displayName: varchar("display_name", { length: 256 }),
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
export type TEventType = (typeof eventTypeEnum.enumValues)[number];
export type TTriggerType = (typeof triggerTypeEnum.enumValues)[number];
export type TCredentialType = (typeof credentialTypeEnum.enumValues)[number];

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

export const nodeTypeEnum = pgEnum("nodeTypeEnum", ["trigger", "action"]);

export const eventTypeEnum = pgEnum("eventTypeEnum", [
  "github:commit-received",
  "gmail:mail-received",
  "gmail:send-mail",
]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  fullName: text("full_name"),
  email: varchar("email", { length: 256 }).unique(),
});

export const workflows = pgTable("workflows", {
  id: serial("id").primaryKey(),
  isActive: boolean("is_active").default(true),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const nodes = pgTable("nodes", {
  id: serial("id").primaryKey(),
  workflowId: integer("workflow_id")
    .references(() => workflows.id)
    .notNull(),
  nodeType: nodeTypeEnum("node_type").notNull(),
  eventType: eventTypeEnum("event_type").notNull(),
});

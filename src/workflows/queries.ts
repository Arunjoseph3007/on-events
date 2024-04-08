import { eq } from "drizzle-orm";
import db from "../db";
import { workflows } from "../db/schema";

function workflowsOfUser(userId: number) {
  return db
    .select()
    .from(workflows)
    .where(eq(workflows.userId, userId))
    .$dynamic();
}

export const WorkflowQueries = { workflowsOfUser };

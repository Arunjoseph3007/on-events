import { desc, eq, getTableColumns, inArray } from "drizzle-orm";
import db from "../db";
import { executions, workflows } from "../db/schema";
import withPagination from "../utils/pagination";

async function getExecutions(userId: number, page: number) {
  const myWorkflows = await db
    .select({ id: workflows.id })
    .from(workflows)
    .where(eq(workflows.userId, userId));

  const myWorkflowIds = myWorkflows.map((m) => m.id);

  const columns = getTableColumns(executions);
  const query = db
    .select({ ...columns, workflowName: workflows.name })
    .from(executions)
    .fullJoin(workflows, eq(workflows.id, executions.workflowId))
    .where(inArray(executions.workflowId, myWorkflowIds))
    .$dynamic();

  const res = await withPagination(query, desc(executions.startedAt), page);

  return res;
}

export const ExecutionsController = { getExecutions };

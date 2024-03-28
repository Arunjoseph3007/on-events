import * as z from "zod";
import { insertWorkflowSchema } from "./schemas";
import db from "../db";
import { nodes, workflows } from "../db/schema";
import { eq } from "drizzle-orm";

async function getWorkflowsOfUser(userId: number) {
  const myWorkflows = await db
    .select()
    .from(workflows)
    .where(eq(workflows.userId, userId));

  return myWorkflows;
}

async function getWorkflowsById(workflowId: number) {
  const thisWorkflow = await db.query.workflows.findFirst({
    where: eq(workflows.id, workflowId),
  });

  if (!thisWorkflow) {
    throw new Error("Workflow not found");
  }

  const thisWorkflowNodes = await db.query.nodes.findMany({
    where: eq(nodes.workflowId, thisWorkflow.id),
  });

  return { ...thisWorkflow, nodes: thisWorkflowNodes };
}

async function createWorkflow(
  payload: z.infer<typeof insertWorkflowSchema>,
  userId: number
) {
  const [workflowRes] = await db
    .insert(workflows)
    .values({ name: payload.name, userId })
    .returning();

  const nodesRes = await db
    .insert(nodes)
    .values(
      payload.nodes.map((node) => ({
        eventType: node.eventType,
        nodeType: node.nodeType,
        workflowId: workflowRes.id,
      }))
    )
    .returning();

  return { ...workflowRes, nodes: nodesRes };
}

async function updateWorkflow(workflowId: number) {
  return 1 as TODO;
}

async function triggerWorkflow(workflowId: number) {
  return 1 as TODO;
}

export const WorkflowsController = {
  createWorkflow,
  getWorkflowsById,
  getWorkflowsOfUser,
  updateWorkflow,
  triggerWorkflow,
};

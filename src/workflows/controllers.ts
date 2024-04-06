import * as z from "zod";
import { insertWorkflowSchema } from "./schemas";
import db from "../db";
import { TEventType, nodes, workflows } from "../db/schema";
import { eq } from "drizzle-orm";
import WorkflowExecution from "./execution";
import { TriggerTypeToController } from "../triggers";

const EventTypeToConfigSchema: Record<TEventType, z.ZodSchema> = {
  "discord:send-message": z.string(),
  "gsheet:append-row": z.array(z.string()),
  "gmail:send-mail": z.object({
    to: z.string().email(),
    from: z.string().email(),
    subject: z.string(),
    content: z.string().min(1),
  }),
};

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
    with: { nodes: true },
  });

  return thisWorkflow;
}

async function createWorkflow(
  payload: z.infer<typeof insertWorkflowSchema>,
  userId: number
) {
  payload.nodes.forEach((node) => {
    node.config = EventTypeToConfigSchema[node.eventType].parse(node.config);
  });

  const [workflowRes] = await db
    .insert(workflows)
    .values({
      name: payload.name,
      userId,
      triggerType: payload.triggerType,
      triggerCredentialId: payload.triggerCredentialId,
      resourceId: payload.resourceId,
    })
    .returning();

  const nodesRes = await db
    .insert(nodes)
    .values(payload.nodes.map((n) => ({ ...n, workflowId: workflowRes.id })))
    .returning();

  if (!workflowRes) return;

  const controller = TriggerTypeToController[workflowRes.triggerType];
  const res = await controller.register(workflowRes);

  return { workflow: workflowRes, nodes: nodesRes };
}

async function updateWorkflow(workflowId: number) {
  // TODO
}

async function triggerWorkflow(workflowId: number, payload: any) {
  const flowExec = new WorkflowExecution(workflowId, payload);

  await flowExec.execute();
}

export const WorkflowsController = {
  createWorkflow,
  getWorkflowsById,
  getWorkflowsOfUser,
  updateWorkflow,
  triggerWorkflow,
};

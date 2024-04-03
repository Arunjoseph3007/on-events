import * as z from "zod";
import { insertWorkflowSchema } from "./schemas";
import db from "../db";
import { TEventType, TNode, TWorkflow, nodes, workflows } from "../db/schema";
import { eq } from "drizzle-orm";
import { GithubCommitTriggerController } from "../triggers/githubCommit";
import WorkflowExecution from "./execution";

const EventTypeToConfigSchema: Record<TEventType, z.ZodSchema> = {
  "discord:send-message": z.string(),
  "gmail:send-mail": z.object({
    to: z.string().email(),
    from: z.string().email(),
    subject: z.string(),
    content: z.string().min(1),
  }),
  "gsheet:append-row": z.array(z.string()),
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
  let workflowRes: TWorkflow | null = {} as TODO;
  const allNodes: TNode[] = [];

  payload.nodes.forEach((node) => {
    node.config = EventTypeToConfigSchema[node.eventType].parse(node.config);
  });

  await db.transaction(async (tx) => {
    [workflowRes] = await tx
      .insert(workflows)
      .values({
        name: payload.name,
        userId,
        triggerType: payload.triggerType,
        triggerCredentialId: payload.triggerCredentialId,
        resourceId: payload.resourceId,
      })
      .returning();

    for (const node of payload.nodes) {
      const [nodesRes] = await tx
        .insert(nodes)
        .values({
          eventType: node.eventType,
          workflowId: workflowRes.id,
          parentNodeId: allNodes.at(-1)?.id || null,
          credentialId: node.credentialId,
          resourceId: node.resourceId,
          config: node.config,
        })
        .returning();
      allNodes.push(nodesRes);
    }
  });

  if (!workflowRes) return;

  switch (payload.triggerType) {
    case "github:commit-received": {
      await GithubCommitTriggerController.register(workflowRes);
      break;
    }
    case "gmail:mail-received": {
      // TODO
      break;
    }
    default: {
      throw new Error("Unknown trigger type");
    }
  }

  return { workflow: workflowRes, nodes: allNodes };
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

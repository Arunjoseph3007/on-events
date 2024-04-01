import type * as z from "zod";
import { insertWorkflowSchema } from "./schemas";
import db from "../db";
import { eventTypeEnum, nodes, workflows } from "../db/schema";
import { eq } from "drizzle-orm";
import { GithubCommitTriggerController } from "../triggers/githubCommit";
import WorkflowExecution from "./execution";

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
  // TODO: rewrite using transactions
  const [workflowRes] = await db
    .insert(workflows)
    .values({ name: payload.name, userId, triggerType: payload.triggerType })
    .returning();

  const allNodes: {
    id: number;
    workflowId: number;
    eventType: (typeof eventTypeEnum.enumValues)[number];
    parentNodeId: number | null;
  }[] = [];
  for (const node of payload.nodes) {
    const [nodesRes] = await db
      .insert(nodes)
      .values({
        eventType: node.eventType,
        workflowId: workflowRes.id,
        parentNodeId: allNodes.at(-1)?.id || null,
      })
      .returning();
    allNodes.push(nodesRes);
  }

  switch (payload.triggerType) {
    case "github:commit-received": {
      await GithubCommitTriggerController.register(
        "Arunjoseph3007",
        "ts-ds",
        process.env.GITHUB_PAT,
        workflowRes.id
      ); // TODO: Implement properly
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

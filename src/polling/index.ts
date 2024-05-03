import { and, eq } from "drizzle-orm";
import db from "../db";
import { type TWorkflow, workflows } from "../db/schema";
import { TPollingController } from "../types/PollingController";
import WorkflowExecution from "../executions/execution";

async function pollWorkflow(workflow: TWorkflow) {
  let invoked = false;
  const workflowId = workflow.id;
  try {
    const controller = {} as TPollingController;

    const pollOutput = await controller.poll(workflow);
    const previousKey = controller.dataDepulicationKeyPath;
    const latestDataKey = extractKey(pollOutput, previousKey);

    if (latestDataKey !== previousKey) {
      return { error: null, data: null, invoked, workflowId };
    }

    invoked = true;
    const execution = new WorkflowExecution(workflow.id, pollOutput);
    const data = await execution.execute();

    await db
      .update(workflows)
      .set({ dataDeduplicationKey: latestDataKey })
      .where(eq(workflows.id, workflow.id));

    return { error: null, data, invoked, workflowId };
  } catch (error) {
    return { error, data: null, invoked, workflowId };
  }
}

export default async function pollAll() {
  const workflowsToBePolled = await db.query.workflows.findMany({
    where: and(eq(workflows.isActive, true), eq(workflows.usePolling, true)),
    with: { triggerCredential: true },
  });

  const allPromises = workflowsToBePolled.map(pollWorkflow);

  const res = await Promise.all(allPromises);
  return res;
}

function extractKey(output: any, key: string) {
  return key.split("__").reduce((acc, cur) => acc[cur], output) as string;
}

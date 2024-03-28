import { InferSelectModel, eq } from "drizzle-orm";
import db from "../db";
import { nodes, workflows } from "../db/schema";

export default class WorkflowExecution {
  private readonly workflowId: number;
  private readonly payload: any;

  constructor(workflowId: number, payload: any) {
    this.workflowId = workflowId;
    this.payload = payload;
  }

  async execute() {
    const thisWorkflow = await db.query.workflows.findFirst({
      where: eq(workflows.id, this.workflowId),
      with: {
        nodes: true,
      },
    });

    if (!thisWorkflow) {
      throw new Error("Workflow not found");
    }

    let currentlyExecutingNode = thisWorkflow.nodes.find(
      (n) => !n.parentNodeId
    );

    while (currentlyExecutingNode) {
      const out = await this.executeNode(currentlyExecutingNode);

      if (!out) {
        return false;
      }

      currentlyExecutingNode = thisWorkflow.nodes.find(
        (n) => n.parentNodeId == currentlyExecutingNode!.id
      );
    }

    return true;
  }

  private async executeNode(
    node: InferSelectModel<typeof nodes>
  ): Promise<boolean> {
    let a: TODO = 0;
    return true;
  }
}

import { InferSelectModel, eq } from "drizzle-orm";
import db from "../db";
import { nodes, workflows } from "../db/schema";
import { DiscordActions } from "../actions/discord";
import { GSheetActions } from "../actions/gsheets";

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
    try {
      switch (node.eventType) {
        case "discord:send-message": {
          const res = await DiscordActions.sendMessage(
            "1223491599556939870",
            "Hello there @hello"
          );
          break;
        }
        case "gsheet:append-row": {
          const res = await GSheetActions.addRow(
            "1UO3NlLd8_VD11sA5ZJWsXwFZztpppOLENtYLHGMysWY",
            ["this", "is", "really", "happening", new Date().toDateString()]
          );
          break;
        }
        case "gmail:send-mail": {
          // TODO
          break;
        }
        default: {
          throw new Error("Unknown action type");
        }
      }
      return true;
    } catch (error) {
      return false;
    }
  }
}

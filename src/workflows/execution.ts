import { eq } from "drizzle-orm";
import db from "../db";
import { TCredential, TEventType, TNode, workflows } from "../db/schema";
import { DiscordActions } from "../actions/discord";
import { GSheetActions } from "../actions/gsheets";
import { GmailActions } from "../actions/gmail";
import { TAction } from "../types/Action";

const ReplacerRegex = /\{\{[0-9a-zA-Z_-]+\}\}/g;

const EventTypeToAction: Record<TEventType, TAction> = {
  "discord:send-message": DiscordActions.sendMessage,
  "gmail:send-mail": GmailActions.sendEmail,
  "gsheet:append-row": GSheetActions.addRow,
};

export default class WorkflowExecution {
  private readonly workflowId: number;
  private readonly executionData: any;

  constructor(workflowId: number, payload: any) {
    this.workflowId = workflowId;
    this.executionData = {
      trigger: payload,
    };
  }

  async execute() {
    const thisWorkflow = await db.query.workflows.findFirst({
      where: eq(workflows.id, this.workflowId),
      with: {
        nodes: {
          with: {
            credential: true,
          },
        },
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
        (n) => n.parentNodeId == currentlyExecutingNode!.internalId
      );
    }

    return true;
  }

  private async executeNode(
    node: TNode & { credential: TCredential | null }
  ): Promise<boolean> {
    try {
      const eventAction = EventTypeToAction[node.eventType];
      const formattedConfig = this.formatConfig(node.config);
      const res = await eventAction(node, formattedConfig);
      this.executionData[node.internalId.toString()] = res;

      return true;
    } catch (error) {
      return false;
    }
  }

  // TODO: replace this janky workaround with actually working solution
  private formatConfig(payload: any) {
    const str = JSON.stringify(payload);
    const replaced = str.replace(ReplacerRegex, (token) =>
      token
        .slice(2, -1)
        .split("__")
        .reduce((acc, cur) => acc[cur], this.executionData)
    );
    const convBack = JSON.parse(replaced);
    return convBack;
  }
}

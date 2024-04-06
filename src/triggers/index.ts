import { TTriggerType } from "../db/schema";
import { TTriggerController } from "../types/TriggerController";
import { GCalenderEventsTriggerController } from "./gcalenderEvents";
import { GithubCommitTriggerController } from "./githubCommit";

export const TriggerTypeToController: Record<TTriggerType, TTriggerController> =
  {
    "gcalender:event-created": GCalenderEventsTriggerController,
    "github:commit-received": GithubCommitTriggerController,
    "gmail:mail-received": null as TODO,
  };

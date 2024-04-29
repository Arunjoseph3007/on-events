import { useNodes } from "reactflow";
import { useMemo } from "react";
import type { TNodeData } from "../types/nodedata";
import type { TCredentialType } from "../../src/db/schema";
import type {
  TSuggestion,
  TTextSuggestions,
} from "../components/common/UltraForm";

const CredTypeToSuggestions: Record<TCredentialType, TSuggestion[]> = {
  "discord:send-message": [],
  "gcalender:event-created": [],
  "github:commit-received": [
    {
      key: "repository__name",
      label: "Repository Name",
      description: "Name of the repository eg react",
    },
    {
      key: "repository__full_name",
      label: "Repository Fullname",
      description: "Full name of the repository eg facebook/react",
    },
    {
      key: "repository__description",
      label: "Repository Description",
    },
    {
      key: "repository__owner_name",
      label: "Repository Owner",
      description: "Full name of the repository Owner",
    },
    {
      key: "head_commit__message",
      label: "Commit message",
      description: "Message entioned in the commit",
    },
    {
      key: "head_commit__author__name",
      label: "Commit Author",
      description: "Full name of the commit author",
    },
  ],
  "gmail:mail-received": [],
  "gmail:send-mail": [],
  "gsheet:append-row": [],
};

export default function useSuggestions() {
  const nodes = useNodes<TNodeData>();

  const suggestions = useMemo(() => {
    return nodes.reduce<TTextSuggestions>((acc, curNode) => {
      if (curNode.type == "new-empty-node") return acc;
      const data = curNode.data.data;
      const isTrigger = data && "triggerType" in data;

      acc.push({
        data: CredTypeToSuggestions[curNode.type as TCredentialType],
        groupName: isTrigger ? "trigger" : data.internalId.toString(),
      });
      return acc;
    }, []);
  }, [nodes]);

  return suggestions;
}

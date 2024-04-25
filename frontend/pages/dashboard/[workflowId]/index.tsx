import { Box } from "@chakra-ui/react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  Panel,
  useEdgesState,
  useNodesState,
  type Edge,
  type Node,
} from "reactflow";
import "reactflow/dist/style.css";
import { useFetch } from "../../../libs/reactQuery";
import type { TNode, TWorkflow } from "../../../../src/db/schema";

export default function SingleWorkflowPage() {
  const params = useParams<"workflowId">();
  const workflowQuery = useFetch<TWorkflow & { nodes: TNode[] }>(
    "/workflows/" + params.workflowId,
    {
      queryKey: ["workflow", params.workflowId],
      enabled: !!params.workflowId,
    }
  );
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    if (!workflowQuery.data) {
      return;
    }

    let y = 100,
      x = 400;
    const allWorkflowNodes: Node[] = [
      {
        id: "trigger",
        position: { x, y },
        data: { label: workflowQuery.data.triggerType },
      },
    ];
    const allEdges: Edge[] = [];

    for (const n of workflowQuery.data.nodes) {
      y += 100;
      allWorkflowNodes.push({
        id: n.internalId.toString(),
        position: { x, y },
        data: { label: n.eventType },
      });

      const parentId = n.parentNodeId || "trigger";
      allEdges.push({
        id: `ed-${parentId}-${n.internalId}`,
        source: parentId.toString(),
        target: n.internalId.toString(),
      });
    }

    setNodes(allWorkflowNodes);
    setEdges(allEdges);
  }, [workflowQuery.data]);

  return (
    <Box w="100%" h="100%">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
      >
        <Panel position="top-left">{params.workflowId}</Panel>
        <Controls />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </Box>
  );
}

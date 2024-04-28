import { Box, Button, HStack, Heading } from "@chakra-ui/react";
import { type ComponentType, useEffect } from "react";
import { useParams } from "react-router-dom";
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  EdgeProps,
  Panel,
  useEdgesState,
  useNodesState,
  type Edge,
  type Node,
} from "reactflow";
import "reactflow/dist/style.css";
import { useFetch } from "../../../libs/reactQuery";
import type { TNode, TWorkflow } from "../../../../src/db/schema";
import { CheckCircleIcon } from "@chakra-ui/icons";
import WorkflowNodeController from "../../../components/dashboard/WorkflowNodeController";
import SelectedNodePanel from "../../../components/dashboard/SelectedNodePanel";
import AddStepEdge from "../../../components/dashboard/AddStepEdge";
import NewEmptyNode from "../../../components/dashboard/NewEmptyNode";
import { TNodeData } from "../../../types/nodedata";
import { useEditor } from "../../../contexts/DiagramEditorContext";
import NewNodePanel from "../../../components/dashboard/NewNodePanel";

const edgeTypes: Record<string, ComponentType<EdgeProps>> = {
  "add-step": AddStepEdge,
};

const nodeTypes: Record<string, ComponentType<any>> = {
  "discord:send-message": WorkflowNodeController,
  "gcalender:event-created": WorkflowNodeController,
  "github:commit-received": WorkflowNodeController,
  "gmail:mail-received": WorkflowNodeController,
  "gmail:send-mail": WorkflowNodeController,
  "gsheet:append-row": WorkflowNodeController,
  "new-empty-node": NewEmptyNode,
};

export default function EditWorkflowPage() {
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
  const { isAdding } = useEditor();

  useEffect(() => {
    if (!workflowQuery.data) {
      return;
    }

    let y = 100,
      x = 400;
    const { nodes, ...triggerData } = workflowQuery.data;
    const allWorkflowNodes: Node<TNodeData>[] = [
      {
        id: "trigger",
        position: { x, y },
        type: workflowQuery.data.triggerType,
        data: {
          type: workflowQuery.data.triggerType,
          data: triggerData,
          isLast: false,
        },
      },
    ];
    const allEdges: Edge[] = [];

    for (const n of workflowQuery.data.nodes) {
      y += 100;
      allWorkflowNodes.push({
        id: n.internalId.toString(),
        position: { x, y },
        type: n.eventType,
        data: {
          type: n.eventType,
          data: n,
          isLast: false,
        },
      });

      const parentId = n.parentNodeId || "trigger";
      allEdges.push({
        id: `ed-${parentId}-${n.internalId}`,
        source: parentId.toString(),
        target: n.internalId.toString(),
        type: "add-step",
      });
    }

    allWorkflowNodes.at(-1)!.data.isLast = true;

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
        nodeTypes={nodeTypes as any}
        edgeTypes={edgeTypes}
      >
        {workflowQuery.isSuccess && (
          <Panel position="top-left">
            <HStack
              gap={8}
              borderColor={"ActiveBorder"}
              borderWidth={2}
              px={6}
              py={2}
              borderRadius={5}
              bg="Background"
            >
              <Heading fontSize="2xl">{workflowQuery.data.name}</Heading>

              <Button size="sm" leftIcon={<CheckCircleIcon />}>
                Save
              </Button>
            </HStack>
          </Panel>
        )}

        <NewNodePanel />

        <SelectedNodePanel />
        <Controls />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </Box>
  );
}

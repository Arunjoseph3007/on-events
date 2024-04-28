import {
  Handle,
  Position,
  useReactFlow,
  type Edge,
  type Node,
  type NodeProps,
} from "reactflow";
import ThirdPartyAppChip from "./ThirdPartyAppChipp";
import { TNodeData } from "../../types/nodedata";
import { Box, Button, useColorModeValue } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { useEditor } from "../../contexts/DiagramEditorContext";

export default function WorkflowNodeController({
  data,
  xPos,
  yPos,
  id,
}: NodeProps<TNodeData>) {
  const { addEdges, getNodes, setNodes } = useReactFlow();
  const { isEditPage, setSelectedNode } = useEditor();
  const isTrigger = "triggerType" in data.data;
  const isLast = data.isLast;

  const addNewEmptyNode = () => {
    const allNodes = getNodes();
    const nextId = allNodes.length.toString();

    const newNode: Node = {
      id: nextId,
      type: "new-empty-node",
      position: {
        x: xPos + 50,
        y: yPos + 50,
      },
      data: {
        label: "New Node",
        isLast: true,
      },
    };

    const newEdge: Edge = {
      id: `ed-${id}-${nextId}`,
      source: id,
      target: nextId,
      type: "add-step",
    };

    setNodes((nodes) =>
      nodes
        .map((n) => ({ ...n, data: { ...n.data, isLast: false } }))
        .concat([newNode])
    );
    addEdges(newEdge);
  };

  return (
    <>
      <Handle type="target" position={Position.Top} />
      <Box onClick={() => setSelectedNode(data)} position="relative">
        <ThirdPartyAppChip
          btnProps={{ w: "200px", h: "50px" }}
          type={data.type}
        />
        {isEditPage && isLast && (
          <Button
            size="xs"
            borderRadius="100px"
            aspectRatio={1}
            left="50%"
            transform="auto"
            translateX="-50%"
            top="130%"
            position="absolute"
            colorScheme="gray"
            borderColor={useColorModeValue("black", "white")}
            variant="outline"
            onClick={addNewEmptyNode}
          >
            <AddIcon />
          </Button>
        )}
      </Box>

      <Handle type="source" position={Position.Bottom} />
    </>
  );
}

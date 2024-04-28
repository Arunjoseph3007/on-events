import { AddIcon } from "@chakra-ui/icons";
import { Box, Button } from "@chakra-ui/react";
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  useReactFlow,
  type Edge,
  type EdgeProps,
  type Node,
} from "reactflow";

export default function AddStepEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  source,
  target,
}: EdgeProps) {
  const { setEdges, addEdges, addNodes, setNodes, getNodes, getNode } =
    useReactFlow();
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const onEdgeClick = () => {
    const allNodes = getNodes();
    const nextId = allNodes.length.toString();

    const srcPos = getNode(source)?.position;
    const targetPos = getNode(target)?.position;

    if (!srcPos || !targetPos) return;

    const newNode: Node = {
      id: nextId,
      type: "new-empty-node",
      position: {
        x: (srcPos.x + targetPos.x) / 2,
        y: (srcPos.y + targetPos.y) / 2,
      },
      data: {
        label: "New Node",
      },
    };

    const newEdges: Edge[] = [
      {
        source,
        target: nextId,
        id: `ed-${source}-${nextId}`,
        type: "add-step",
      },
      {
        source: nextId,
        target,
        id: `ed-${nextId}-${target}`,
        type: "add-step",
      },
    ];

    addNodes(newNode);
    setEdges((edg) => edg.filter((edge) => edge.id !== id).concat(newEdges));
  };

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      <EdgeLabelRenderer>
        <Box
          position="absolute"
          cursor="pointer"
          transform={`translate(-50%, -50%) translate(${labelX}px,${labelY}px)`}
          className="nodrag nopan"
          pointerEvents="all"
        >
          <Button
            onClick={onEdgeClick}
            bg="InfoText"
            size="xs"
            borderRadius="1000px"
            aspectRatio={1}
          >
            <AddIcon />
          </Button>
        </Box>
      </EdgeLabelRenderer>
    </>
  );
}

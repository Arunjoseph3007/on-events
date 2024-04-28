import { DeleteIcon } from "@chakra-ui/icons";
import { HStack, IconButton, Text } from "@chakra-ui/react";
import { Handle, NodeProps, Position, useReactFlow } from "reactflow";
import { useEditor } from "../../contexts/DiagramEditorContext";

export default function NewEmptyNode({ id }: NodeProps) {
  const { setIsAdding, setSelectedNode } = useEditor();
  const { setNodes, setEdges, getEdges } = useReactFlow();

  const deleteNewNode: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();

    const allEdges = getEdges();
    const delEdge = allEdges.find((ed) => ed.target == id);
    if (!delEdge) return;

    setEdges((eds) => eds.filter((ed) => ed.id != delEdge.id));
    setNodes((nds) => {
      const arr = nds.filter((nd) => nd.id != id);
      const lastIndex = arr.findIndex((el) => el.id == delEdge.source);
      if (lastIndex >= 0) {
        arr[lastIndex].data.isLast = true;
      }
      return arr;
    });
  };

  return (
    <>
      <Handle type="target" position={Position.Top} />
      <HStack
        onClick={() => {
          setSelectedNode(null);
          setIsAdding(true);
        }}
        pointerEvents="all"
        borderColor="green.300"
        borderWidth={3}
        bg="Background"
        borderRadius={"md"}
        w="200px"
        h="50px"
        p={3}
      >
        <Text flex={1}>New Node</Text>
        <IconButton
          onClick={deleteNewNode}
          aria-label="Delete"
          colorScheme="gray"
          size="sm"
          icon={<DeleteIcon />}
        />
      </HStack>
      <Handle type="source" position={Position.Bottom} />
    </>
  );
}

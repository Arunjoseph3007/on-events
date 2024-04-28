import { createContext, useContext, useState } from "react";
import { Outlet, useMatch } from "react-router-dom";
import type { TNodeData } from "../types/nodedata";

type TDiagramEditorContext = {
  selectedNode: TNodeData | null;
  setSelectedNode: (p: TNodeData | null) => void;
  isAdding: boolean;
  setIsAdding: (p: boolean) => void;
  isEditPage: boolean;
};

const DiagramEditorContext = createContext<TDiagramEditorContext>({} as any);

export default function DiagramProvider() {
  const [selectedNode, setSelectedNode] = useState<TNodeData | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const isEditPage = useMatch("/workflows/:workflowId/edit");

  return (
    <DiagramEditorContext.Provider
      value={{
        selectedNode,
        setSelectedNode,
        isAdding,
        setIsAdding,
        isEditPage: !!isEditPage,
      }}
    >
      <Outlet />
    </DiagramEditorContext.Provider>
  );
}

export function useEditor() {
  const editorContext = useContext(DiagramEditorContext);

  if (!editorContext) {
    throw Error("Missing DiagramEditorContextProvider");
  }

  return editorContext;
}

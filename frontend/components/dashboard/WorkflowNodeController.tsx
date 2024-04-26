import { Handle, Position } from "reactflow";
import type { TCredentialType } from "../../../src/db/schema";
import ThirdPartyAppChip from "./ThirdPartyAppChipp";

export default function WorkflowNodeController({
  type,
}: {
  type: TCredentialType;
}) {
  return (
    <>
      <Handle type="target" position={Position.Top} />
      <ThirdPartyAppChip btnProps={{ w: "200px", h: "50px" }} type={type} />
      <Handle type="source" position={Position.Bottom} />
    </>
  );
}

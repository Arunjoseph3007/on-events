import {
  Badge,
  Box,
  Divider,
  Heading,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useFetch } from "../../libs/reactQuery";
import moment from "moment";
import type { TPaginationResponse } from "../../../src/utils/pagination";
import type { TWorkflow } from "../../../src/db/schema";
import ThirdPartyAppChip from "../../components/dashboard/ThirdPartyAppChipp";

export default function WorkflowsPage() {
  const workflowsQuery = useFetch<TPaginationResponse<TWorkflow[]>>(
    "/workflows",
    { queryKey: ["workflows"] }
  );

  return (
    <Box p={12}>
      <Heading>Your Workflows</Heading>
      <Divider py={2} />
      {workflowsQuery.isSuccess && (
        <TableContainer>
          <Table colorScheme="gray">
            <Thead>
              <Tr>
                <Th>Id</Th>
                <Th>Name</Th>
                <Th>Trigger</Th>
                <Th>Resource</Th>
                <Th>Created at</Th>
                <Th>Status</Th>
              </Tr>
            </Thead>
            <Tbody>
              {workflowsQuery.data.data.map((workflow, idx) => (
                <Tr key={workflow.id}>
                  <Td>
                    <Text fontSize="xs" fontWeight={900} color={"GrayText"}>
                      {idx + 1}.
                    </Text>
                  </Td>
                  <Td>
                    <Text fontWeight={600}>{workflow.name}</Text>
                  </Td>
                  <Td>
                    <ThirdPartyAppChip type={workflow.triggerType} />
                  </Td>
                  <Td>{workflow.resourceId}</Td>
                  <Td>{moment(workflow.createdAt).fromNow()}</Td>
                  <Td>
                    <Badge colorScheme={workflow.isActive ? "whatsapp" : "red"}>
                      {workflow.isActive ? "active" : "inactive"}
                    </Badge>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}

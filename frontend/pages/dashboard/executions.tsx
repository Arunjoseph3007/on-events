import {
  Box,
  Divider,
  Heading,
  Table,
  TableContainer,
  Tag,
  TagLabel,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
} from "@chakra-ui/react";
import { useFetch } from "../../libs/reactQuery";
import moment from "moment";
import type { TPaginationResponse } from "../../../src/utils/pagination";
import type { TExecution, TExecutionStatusType } from "../../../src/db/schema";
import { ReactNode } from "react";
import { RocketIcon } from "../../icons/rocket";
import { NotAllowedIcon, SpinnerIcon, WarningIcon } from "@chakra-ui/icons";

const ExecutionStatusToColorScheme: Record<TExecutionStatusType, string> = {
  failure: "red",
  paused: "gray",
  running: "yellow",
  success: "green",
};

const ExecutionStatusToIcon: Record<TExecutionStatusType, ReactNode> = {
  failure: <WarningIcon />,
  paused: <NotAllowedIcon />,
  running: <SpinnerIcon />,
  success: <RocketIcon />,
};

export default function ExecutionsPage() {
  const executionsQuery = useFetch<
    TPaginationResponse<(TExecution & { workflowName: string })[]>
  >("/executions", { queryKey: ["executions"] });

  return (
    <Box p={12}>
      <Heading>Your Executions</Heading>
      <Divider py={2} />
      {executionsQuery.isSuccess && (
        <TableContainer>
          <Table colorScheme="gray">
            <Thead>
              <Tr>
                <Th>Id</Th>
                <Th>Workflow</Th>
                <Th>Status</Th>
                <Th>Message</Th>
                <Th>Started at</Th>
                <Th>Finished at</Th>
                <Th>Time taken</Th>
              </Tr>
            </Thead>
            <Tbody>
              {executionsQuery.data.data.map((execution, idx) => {
                const startedAt = moment(execution.startedAt);
                const finishedAt = moment(execution.finishedAt);
                const status = execution.status;

                return (
                  <Tr key={execution.id}>
                    <Td>
                      <Text fontSize="xs" fontWeight={900} color={"GrayText"}>
                        {idx + 1}.
                      </Text>
                    </Td>
                    <Td>
                      <Text fontWeight={600}>{execution.workflowName}</Text>
                    </Td>
                    <Td>
                      <Tag
                        gap={2}
                        colorScheme={ExecutionStatusToColorScheme[status]}
                      >
                        {ExecutionStatusToIcon[status]}
                        <TagLabel>{status.toUpperCase()}</TagLabel>
                      </Tag>
                    </Td>
                    <Td>
                      <Tooltip
                        textAlign="center"
                        hasArrow
                        placement="right"
                        label={execution.message}
                      >
                        <Text w="150px" isTruncated>
                          {execution.message || "-"}
                        </Text>
                      </Tooltip>
                    </Td>
                    <Td>{startedAt.format("lll")}</Td>
                    <Td>{finishedAt.format("lll")}</Td>
                    <Td>
                      <Text align="center" fontWeight={500} color="GrayText">
                        {startedAt.diff(finishedAt, "milliseconds")} ms
                      </Text>
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}

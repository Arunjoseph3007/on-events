import {
  Box,
  Button,
  Divider,
  HStack,
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
import type { TCredential } from "../../../src/db/schema";
import ThirdPartyAppChip from "../../components/dashboard/ThirdPartyAppChipp";
import { AddIcon } from "@chakra-ui/icons";

export default function CredentialsPage() {
  const credsQuery = useFetch<TPaginationResponse<TCredential[]>>(
    "/credentials",
    { queryKey: ["credentials"] }
  );

  return (
    <Box p={12}>
      <HStack>
        <Heading flex={1}>Your Credentials</Heading>
        <Button leftIcon={<AddIcon />}>Add</Button>
      </HStack>
      <Divider py={2} />
      {credsQuery.isSuccess && (
        <TableContainer>
          <Table colorScheme="gray">
            <Thead>
              <Tr>
                <Th>Id</Th>
                <Th>Type</Th>
                <Th>Client Id</Th>
                <Th>Expiry</Th>
              </Tr>
            </Thead>
            <Tbody>
              {credsQuery.data.data.map((cred, idx) => (
                <Tr key={cred.id}>
                  <Td>
                    <Text fontSize="xs" fontWeight={900} color={"GrayText"}>
                      {idx + 1}.
                    </Text>
                  </Td>
                  <Td>
                    <ThirdPartyAppChip type={cred.credentialType} />
                  </Td>
                  <Td>
                    <Text align="center" fontWeight={600}>
                      {cred.clientId || "-"}
                    </Text>
                  </Td>
                  <Td>
                    {cred.expiry ? moment(cred.expiry).fromNow() : "No expiry"}
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

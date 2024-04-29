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
import { DeleteIcon } from "@chakra-ui/icons";
import AddCredDrawer from "../../components/dashboard/AddCredDrawer";

export default function CredentialsPage() {
  const credsQuery = useFetch<
    TPaginationResponse<Omit<TCredential, "accessToken">[]>
  >("/credentials", { queryKey: ["credentials"] });

  return (
    <Box p={12}>
      {/* Header */}
      <HStack>
        <Heading flex={1}>Your Credentials</Heading>
        <AddCredDrawer />
      </HStack>

      <Divider my={2} />

      {/* Table */}
      {credsQuery.isSuccess && (
        <TableContainer>
          <Table colorScheme="gray">
            <Thead>
              <Tr>
                <Th>Id</Th>
                <Th>Display Name</Th>
                <Th>Type</Th>
                <Th>Client Id</Th>
                <Th>Expiry</Th>
                <Th>Delete</Th>
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
                    <Text fontWeight={600}>{cred.displayName}</Text>
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
                  <Td>
                    <Button colorScheme="gray" variant="ghost">
                      <DeleteIcon boxSize={5} />
                    </Button>
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

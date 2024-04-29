import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  HStack,
  Heading,
  Image,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { useEditor } from "../../contexts/DiagramEditorContext";
import { Panel } from "reactflow";
import { ChevronDownIcon, CloseIcon } from "@chakra-ui/icons";
import { EventTypeValues } from "../../../common/schema";
import ThirdPartyAppChip from "./ThirdPartyAppChipp";
import { useState } from "react";
import type { TCredential, TEventType } from "../../../src/db/schema";
import { CredTypeToHelperText } from "../../utils/credType";
import { useFetch } from "../../libs/reactQuery";
import type { TPaginationResponse } from "../../../src/utils/pagination";
import { CredentialsIcon } from "../../icons/credentials";
import UltraForm from "../common/UltraForm";
import { UltraFormConfigOf } from "../../../common/ultraFormConfigs";
import useSuggestions from "../../hooks/useSuggestions";

export default function NewNodePanel() {
  const [actionType, setActionType] = useState<TEventType>();
  const [credId, setCredId] = useState<Omit<TCredential, "accessToken">>();
  const { isAdding, setIsAdding } = useEditor();
  const suggestions = useSuggestions();

  const credsSearchQuery = useFetch<
    TPaginationResponse<Omit<TCredential, "accessToken">[]>
  >("/credentials/type/" + actionType, {
    queryKey: ["credentials", actionType],
    enabled: !!actionType,
  });

  if (!isAdding) return null;

  return (
    <Panel position="top-right">
      <Flex
        direction="column"
        bg="Background"
        boxShadow="lg"
        w="35vw"
        h="85vh"
        borderRadius={10}
        p={3}
        pr={1}
      >
        {/* Header */}
        <HStack borderBottomWidth={2} pb={2} mb={2}>
          <Image
            boxSize="45px"
            borderRadius={5}
            objectFit="cover"
            src="/logo.png"
            alt="On events"
          />
          <Heading textTransform="capitalize" flex={1} fontSize="xl">
            New Empty Node
          </Heading>

          <Button onClick={() => setIsAdding(false)}>
            <CloseIcon />
          </Button>
        </HStack>

        <Box pr={2} overflowY="auto" flex={1}>
          <FormControl isRequired>
            <FormLabel>Trigger Type</FormLabel>
            {!actionType && (
              <>
                <Menu colorScheme="gray">
                  <MenuButton
                    w="100%"
                    as={Button}
                    rightIcon={<ChevronDownIcon />}
                  >
                    Action Type
                  </MenuButton>
                  <MenuList>
                    {EventTypeValues.map((type) => (
                      <MenuItem
                        onClick={() => setActionType(type)}
                        key={type}
                        w="420px"
                      >
                        <ThirdPartyAppChip type={type} />
                      </MenuItem>
                    ))}
                  </MenuList>
                </Menu>
                <FormHelperText>Please select a Action type</FormHelperText>
              </>
            )}
          </FormControl>

          {actionType && (
            <>
              <HStack>
                <ThirdPartyAppChip type={actionType} />
                <Button
                  colorScheme="red"
                  onClick={() => setActionType(undefined)}
                >
                  <CloseIcon />
                </Button>
              </HStack>

              <Divider py={2} />

              <FormControl isRequired>
                <FormLabel>Resource ID</FormLabel>
                <Input />
                <FormHelperText>
                  {CredTypeToHelperText[actionType]}
                </FormHelperText>
              </FormControl>

              <Divider py={2} />

              {credsSearchQuery.isLoading && <Spinner />}

              {credsSearchQuery.isSuccess &&
                credsSearchQuery.data.data.length > 0 && (
                  <FormControl isRequired>
                    <FormLabel>Select Credential</FormLabel>

                    {!credId && (
                      <Menu colorScheme="gray">
                        <MenuButton
                          w="100%"
                          as={Button}
                          rightIcon={<ChevronDownIcon />}
                        >
                          Select Credential
                        </MenuButton>
                        <MenuList>
                          {credsSearchQuery.data.data.map((cred) => (
                            <MenuItem
                              onClick={() => setCredId(cred)}
                              key={cred.id}
                              w="420px"
                            >
                              <Text isTruncated>{cred.displayName}</Text>
                            </MenuItem>
                          ))}
                        </MenuList>
                      </Menu>
                    )}
                  </FormControl>
                )}

              {credId && (
                <HStack>
                  <Button
                    w="100%"
                    colorScheme="gray"
                    leftIcon={<CredentialsIcon />}
                  >
                    {credId.displayName}
                  </Button>
                  <Button
                    colorScheme="red"
                    onClick={() => setCredId(undefined)}
                  >
                    <CloseIcon />
                  </Button>
                </HStack>
              )}

              <UltraForm
                data={UltraFormConfigOf[actionType]}
                suggestions={suggestions}
              />
            </>
          )}
        </Box>

        <HStack justifyContent="flex-end">
          <Button>Save</Button>
          <Button onClick={() => setIsAdding(false)} variant="outline">
            Cancel
          </Button>
        </HStack>
      </Flex>
    </Panel>
  );
}

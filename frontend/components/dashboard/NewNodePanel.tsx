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
} from "@chakra-ui/react";
import { useEditor } from "../../contexts/DiagramEditorContext";
import { Panel } from "reactflow";
import { ChevronDownIcon, CloseIcon } from "@chakra-ui/icons";
import { EventTypeValues, TriggerTypeValues } from "../../../common/schema";
import ThirdPartyAppChip from "./ThirdPartyAppChipp";
import { useState } from "react";
import type { TEventType } from "../../../src/db/schema";
import { CredTypeToHelperText } from "../../utils/credType";

export default function NewNodePanel() {
  const [actionType, setActionType] = useState<TEventType>();
  const { isAdding, setIsAdding } = useEditor();

  if (!isAdding) return null;

  return (
    <Panel position="top-right">
      <Flex
        direction="column"
        bg="Background"
        boxShadow="lg"
        w="450px"
        h="85vh"
        borderRadius={10}
        p={3}
        pr={1}
      >
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

          <Button onClick={close}>
            <CloseIcon />
          </Button>
        </HStack>

        <Box pr={2} overflowY="auto" flex={1}>
          <FormControl isRequired>
            <FormLabel>Trigger Type</FormLabel>
            <Menu colorScheme="gray">
              <MenuButton w="100%" as={Button} rightIcon={<ChevronDownIcon />}>
                Credential Type
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
          </FormControl>

          {actionType && (
            <>
              <Divider my={4} />
              <HStack>
                <ThirdPartyAppChip type={actionType} />
                <Button
                  colorScheme="red"
                  onClick={() => setActionType(undefined)}
                >
                  <CloseIcon />
                </Button>
              </HStack>

              <FormControl isRequired>
                <FormLabel>Resource ID</FormLabel>
                <Input />
                <FormHelperText>
                  {CredTypeToHelperText[actionType]}
                </FormHelperText>
              </FormControl>
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

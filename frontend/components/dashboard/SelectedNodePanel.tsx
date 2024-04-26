import { CloseIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  HStack,
  Heading,
  Image,
  Input,
} from "@chakra-ui/react";
import { useState } from "react";
import { Node, Panel, useOnSelectionChange } from "reactflow";
import { CredTypeToImg, TThirdPartyAppTypes } from "../../utils/credTypeToImg";
import type { TCredentialType, TNode, TWorkflow } from "../../../src/db/schema";
import UltraForm, { TUltraFormFeildType } from "../common/UltraForm";

const CredTypeToHelperText: Record<TCredentialType, string> = {
  "discord:send-message":
    "Id of the channel that you want the message to be sent",
  "gcalender:event-created": "Id of the calender which you want to listen",
  "github:commit-received": "Repository name. eg 'facebook/react'",
  "gmail:mail-received":
    "Email Id of the person you want to send. eg john.doe@gmail.com",
  "gmail:send-mail":
    "Email Id on which you want to listen. eg john.doe@gmail.com",
  "gsheet:append-row": "Google sheet Id",
};

export default function SelectedNodePanel() {
  const [selectedNode, setSelectedNode] =
    useState<Node<TNode | TWorkflow, TCredentialType>>();

  useOnSelectionChange({
    onChange: ({ nodes }) => {
      if (nodes.length > 0) {
        setSelectedNode(nodes[0] as any);
      }
    },
  });

  const close = () => setSelectedNode(undefined);

  if (selectedNode) {
    const appName = selectedNode.type?.split(":")[0] as TThirdPartyAppTypes;

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
        >
          <HStack borderBottomWidth={2} pb={2} mb={2}>
            <Image
              boxSize="50px"
              borderRadius={5}
              objectFit="cover"
              src={CredTypeToImg[appName]}
              alt={appName}
            />
            <Heading textTransform="capitalize" flex={1} fontSize="xl">
              {selectedNode.type?.split(/:|-/).join(" ")}
            </Heading>

            <Button onClick={close}>
              <CloseIcon />
            </Button>
          </HStack>

          <Box overflowY="auto" flex={1}>
            <FormControl isRequired>
              <FormLabel>Resource ID</FormLabel>
              <Input value={selectedNode.data.resourceId} />
              <FormHelperText>
                {CredTypeToHelperText[selectedNode.type!]}
              </FormHelperText>
            </FormControl>

            <UltraForm
              data={[
                TUltraFormFeildType.Number,
                TUltraFormFeildType.String,
                TUltraFormFeildType.Multiline,
                TUltraFormFeildType.Boolean,
                TUltraFormFeildType.Select,
              ]
                .map((type) => [
                  {
                    type,
                    label: "Single " + type,
                    helperText: "Hello this is helper text",
                    required: true,
                    isMultiple: false,
                    selectOptions: ["abcd", "New York", "Dombivli"],
                  },
                  {
                    type,
                    label: "Multiple " + type,
                    helperText: "Hello this is helper text",
                    required: true,
                    isMultiple: true,
                    selectOptions: ["abcd", "New York", "Dombivli"],
                  },
                ])
                .flat()}
            />
          </Box>

          <HStack justifyContent="flex-end">
            <Button>Save</Button>
            <Button onClick={close} variant="outline">
              Cancel
            </Button>
          </HStack>
        </Flex>
      </Panel>
    );
  }

  return null;
}

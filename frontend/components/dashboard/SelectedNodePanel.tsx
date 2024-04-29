import { CloseIcon } from "@chakra-ui/icons";
import {
  Badge,
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
import { Panel } from "reactflow";
import {
  CredTypeToHelperText,
  CredTypeToImg,
  TThirdPartyAppTypes,
} from "../../utils/credType";
import { useEditor } from "../../contexts/DiagramEditorContext";
import UltraForm from "../common/UltraForm";
import { getUltraConfigsOf } from "../../../common/ultraFormConfigs";
import useSuggestions from "../../hooks/useSuggestions";

export default function SelectedNodePanel() {
  const { selectedNode, setSelectedNode, isEditPage } = useEditor();
  const close = () => setSelectedNode(null);
  const suggestions = useSuggestions();

  if (!selectedNode) {
    return null;
  }

  const appName = selectedNode.type?.split(":")[0] as TThirdPartyAppTypes;
  const isTrigger = "triggerType" in selectedNode.data;

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

          {isTrigger && <Badge>Trigger</Badge>}
          <Button onClick={close}>
            <CloseIcon />
          </Button>
        </HStack>

        <Box pr={2} overflowY="auto" flex={1}>
          <FormControl isRequired>
            <FormLabel>Resource ID</FormLabel>
            <Input value={selectedNode.data.resourceId} />
            <FormHelperText>
              {CredTypeToHelperText[selectedNode.type!]}
            </FormHelperText>
          </FormControl>

          <UltraForm
            suggestions={suggestions}
            data={
              !isTrigger
                ? getUltraConfigsOf(selectedNode.data.eventType, {
                    readonly: !isEditPage,
                    initialValues: selectedNode.data.config,
                  })
                : []
            }
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

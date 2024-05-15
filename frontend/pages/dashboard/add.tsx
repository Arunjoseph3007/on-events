import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Box,
  useDisclosure,
  Button,
  Image,
  Grid,
  Text,
  Center,
  HStack,
  Heading,
  FormControl,
  FormLabel,
  Input,
  FormHelperText,
  useSteps,
  Step,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  Stepper,
  StepDescription,
  StepTitle,
  Flex,
  Divider,
} from "@chakra-ui/react";
import { TriggerTypeValues } from "../../../common/schema";
import {
  CredTypeToHelperText,
  CredTypeToImg,
  type TThirdPartyAppTypes,
} from "../../utils/credType";
import { type ComponentType, useState } from "react";
import type {
  TCredentialType,
  TTriggerType,
  TWorkflow,
} from "../../../src/db/schema";
import ReactFlow, {
  type NodeProps,
  useEdgesState,
  useNodesState,
  Panel,
  Controls,
  Background,
  BackgroundVariant,
} from "reactflow";
import type { TNodeData } from "../../types/nodedata";
import WorkflowNodeController from "../../components/dashboard/WorkflowNodeController";
import { EditIcon } from "@chakra-ui/icons";
import SelectedNodePanel from "../../components/dashboard/SelectedNodePanel";

const nodeTypes: Record<
  TCredentialType,
  ComponentType<NodeProps<TNodeData>>
> = {
  "discord:send-message": WorkflowNodeController,
  "gcalender:event-created": WorkflowNodeController,
  "github:commit-received": WorkflowNodeController,
  "gmail:mail-received": WorkflowNodeController,
  "gmail:send-mail": WorkflowNodeController,
  "gsheet:append-row": WorkflowNodeController,
};

const steps = [
  { title: "Name", description: "Enter name" },
  { title: "Trigger", description: "Select Trigger" },
  { title: "Resource", description: "Setup Resource" },
  { title: "Auth Credential", description: "Setup OAuth Credential" },
];

export default function AddPage() {
  const { isOpen, onOpen, onClose } = useDisclosure({ defaultIsOpen: true });
  const [selected, setSelected] = useState<TTriggerType>();
  const [name, setName] = useState("");
  const [resourceId, setResourceId] = useState("");
  const [initialized, setInitialized] = useState(false);
  const [nodes, setNodes, onNodesChange] = useNodesState<TNodeData>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { activeStep, goToNext, goToPrevious } = useSteps({
    count: steps.length,
  });

  const onTriggerSelect = () => {
    if (!selected) return;

    setNodes([
      {
        id: "trigger",
        position: { x: 200, y: 200 },
        type: selected,
        data: {
          data: {
            createdAt: new Date(),
            dataDeduplicationKey: "",
            id: 0,
            isActive: true,
            name: "Untitled Workflow",
            pollingUrl: "",
            resourceId: "",
            triggerCredentialId: 0,
            triggerType: selected,
            usePolling: true,
            userId: 0,
            webHookId: "",
          } satisfies TWorkflow,
          type: selected,
          isLast: true,
        },
      },
    ]);

    setInitialized(true);
    onClose();
  };

  return (
    <Box w="100%">
      {!initialized && (
        <Center h="100%">
          <Button size="md" onClick={onOpen}>
            Select a Trigger to continue
          </Button>
        </Center>
      )}

      {initialized && (
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes as any}
        >
          <Panel position="top-left">
            <HStack
              gap={8}
              borderColor={"ActiveBorder"}
              borderWidth={2}
              px={6}
              py={2}
              borderRadius={5}
              bg="Background"
            >
              <Heading fontSize="2xl">Untitled Workflow</Heading>
              <Button size="sm" leftIcon={<EditIcon />}>
                Edit
              </Button>
            </HStack>
          </Panel>

          <SelectedNodePanel />
          <Controls />
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        </ReactFlow>
      )}

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent maxW="750px" minH="400px">
          <ModalHeader>Configure workflow</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex>
              <Stepper
                orientation="vertical"
                mb={4}
                index={activeStep}
                height="400px"
              >
                {steps.map((step) => (
                  <Step key={step.title}>
                    <StepIndicator>
                      <StepStatus
                        complete={<StepIcon />}
                        incomplete={<StepNumber />}
                        active={<StepNumber />}
                      />
                    </StepIndicator>
                    <Box flexShrink="0">
                      <StepTitle>{step.title}</StepTitle>
                      <StepDescription>{step.description}</StepDescription>
                    </Box>
                    <StepSeparator />
                  </Step>
                ))}
              </Stepper>

              <Divider orientation="vertical" px={2} />

              <Box borderLeftWidth="1px" pl={2}>
                {activeStep == 0 && (
                  <FormControl>
                    <FormLabel>Workflow Name</FormLabel>
                    <Input
                      type="text"
                      onChange={(e) => setName(e.target.value)}
                      value={name}
                    />
                    <FormHelperText>
                      Give a suitable name to your workflow.
                    </FormHelperText>
                  </FormControl>
                )}
                {activeStep == 1 && (
                  <Grid
                    mx="auto"
                    placeItems="center"
                    gap={3}
                    templateColumns="auto auto auto"
                  >
                    {TriggerTypeValues.map((trigger) => (
                      <Button
                        flexDir="column"
                        colorScheme="gray"
                        h="100px"
                        w="150px"
                        key={trigger}
                        onClick={() => setSelected(trigger)}
                        borderWidth={selected == trigger ? 4 : 0}
                        borderColor="green.400"
                      >
                        <Image
                          borderRadius="10px"
                          boxSize="45px"
                          objectFit="cover"
                          src={
                            CredTypeToImg[
                              trigger.split(":")[0] as TThirdPartyAppTypes
                            ]
                          }
                        />
                        <Text textTransform="capitalize" fontSize="xs">
                          {trigger.replace(/:|-/g, " ")}
                        </Text>
                      </Button>
                    ))}
                  </Grid>
                )}
                {activeStep == 2 && (
                  <FormControl>
                    <FormLabel>Resource ID</FormLabel>
                    <Input
                      type="text"
                      onChange={(e) => setResourceId(e.target.value)}
                      value={resourceId}
                    />
                    <FormHelperText>
                      {CredTypeToHelperText[selected!]}
                    </FormHelperText>
                  </FormControl>
                )}
              </Box>
            </Flex>
          </ModalBody>

          <ModalFooter>
            <Button mr={3} onClick={goToPrevious}>
              Previous
            </Button>
            <Button onClick={goToNext} variant="outline">
              Next
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

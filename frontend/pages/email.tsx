import { ArrowForwardIcon, ChevronRightIcon } from "@chakra-ui/icons";
import welcome from "../../src/mails/welcome";
import { useState } from "react";
import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Input,
  InputGroup,
  InputLeftAddon,
  Menu,
  MenuButton,
  MenuList,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";

type TEmailTemplate<TProps = any> = {
  (p: TProps): JSX.Element;
  PreviewProps: TProps;
};

const templateToComponent: Record<string, TEmailTemplate> = {
  welcome,
};

export default function EmailPreviewPage() {
  const [templateName, setTemplatename] = useState("");

  const Component = templateToComponent[templateName];

  return (
    <Flex h="100vh" style={{ borderCollapse: "inherit" }}>
      <Flex
        direction="column"
        minW="250px"
        borderRightWidth="1px"
        gap={4}
        p={4}
      >
        {Object.keys(templateToComponent).map((template) => (
          <Button
            colorScheme="gray"
            variant={templateName == template ? "solid" : "ghost"}
            textTransform="capitalize"
            justifyContent="space-between"
            onClick={() => setTemplatename(template)}
            key={template}
            rightIcon={<ChevronRightIcon boxSize={8} />}
          >
            {template}
          </Button>
        ))}
      </Flex>
      <VStack flex={1}>
        <Box w="100%" h="10vh" py={2} px={4} boxShadow={"base"}>
          <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
            <Heading textTransform="capitalize">
              {templateName ? templateName + " : Preview" : "Select a template"}
            </Heading>

            <Menu>
              <MenuButton as={Button} variant="outline">
                Send
              </MenuButton>

              <MenuList>
                <Flex gap={2} px={2} direction="column">
                  <InputGroup>
                    <InputLeftAddon w="80px">From</InputLeftAddon>
                    <Input type="email" placeholder="john.doe@mail.com" />
                  </InputGroup>
                  <InputGroup>
                    <InputLeftAddon w="80px">To</InputLeftAddon>
                    <Input type="email" placeholder="john.doe@mail.com" />
                  </InputGroup>
                  <InputGroup>
                    <InputLeftAddon w="80px">Subject</InputLeftAddon>
                    <Input type="text" />
                  </InputGroup>
                  <Button>Send</Button>
                </Flex>
              </MenuList>
            </Menu>
          </Flex>
        </Box>

        {Component ? (
          <Component {...Component.PreviewProps} />
        ) : (
          <Center flexDirection="column" h="100vh">
            <Text fontSize={150} fontWeight={900}>
              HEY,
            </Text>
            <Text fontSize={20}>Please select a template to preview here</Text>
            <Link to="/">
              <Button mt={6} rightIcon={<ArrowForwardIcon />}>
                Home
              </Button>
            </Link>
          </Center>
        )}
      </VStack>
    </Flex>
  );
}

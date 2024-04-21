import {
  Box,
  Flex,
  Avatar,
  Text,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useColorModeValue,
  Stack,
  useColorMode,
  Center,
  Image,
  HStack,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";

interface Props {
  children: React.ReactNode;
}

const NavLink = (props: Props) => {
  const { children } = props;

  return (
    <Box
      as="a"
      px={2}
      py={1}
      rounded={"md"}
      _hover={{
        textDecoration: "none",
        bg: useColorModeValue("gray.200", "gray.700"),
      }}
      href={"#"}
    >
      {children}
    </Box>
  );
};

export default function Navbar() {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Box h="10vh" py={2} px={4} boxShadow={"base"}>
      <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
        <HStack gap={3}>
          <Image boxSize="25px" src="/logo.png" />
          <Text
            fontFamily="monospace"
            textTransform="uppercase"
            fontSize="xl"
            fontWeight={700}
          >
            On Events
          </Text>
        </HStack>

        <Flex alignItems={"center"}>
          <Stack direction={"row"} spacing={7}>
            <Button colorScheme="gray" onClick={toggleColorMode}>
              {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
            </Button>

            <Menu>
              <MenuButton
                as={Button}
                rounded={"full"}
                variant={"link"}
                cursor={"pointer"}
                minW={0}
              >
                <Avatar size={"sm"} name="Arun Joseph" />
              </MenuButton>
              <MenuList alignItems={"center"}>
                <br />
                <Center>
                  <Avatar size={"2xl"} name="Arun Joseph" />
                </Center>
                <br />
                <Center>
                  <ChakraLink as={Link} to="/dashboard">
                    Arun Joseph
                  </ChakraLink>
                </Center>
                <br />
                <MenuDivider />
                <MenuItem>Your Servers</MenuItem>
                <MenuItem>Account Settings</MenuItem>
                <MenuItem>Logout</MenuItem>
              </MenuList>
            </Menu>

            <Link to="/login">
              <Button>Login</Button>
            </Link>
            <Link to="/signup">
              <Button variant="outline">Sign up</Button>
            </Link>
          </Stack>
        </Flex>
      </Flex>
    </Box>
  );
}

import {
  Button,
  Divider,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  FormControl,
  FormHelperText,
  FormLabel,
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import type { TCredentialType } from "../../../src/db/schema";
import ThirdPartyAppChip from "../../components/dashboard/ThirdPartyAppChipp";
import { AddIcon, ChevronDownIcon, CloseIcon } from "@chakra-ui/icons";
import { useRef, useState } from "react";
import { CredentialTypeValues } from "../../../common/schema";

const OAuthActions: Record<TCredentialType, () => Promise<boolean>> = {
  "discord:send-message": async () => true,
  "gcalender:event-created": async () => true,
  "github:commit-received": async () => true,
  "gmail:mail-received": async () => true,
  "gmail:send-mail": async () => true,
  "gsheet:append-row": async () => true,
};

export default function AddCredDrawer() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [credType, setCredType] = useState<TCredentialType>();
  const btnRef = useRef<HTMLButtonElement>(null);
  const toast = useToast();

  const handleOAuthFlow = async () => {
    if (!credType) {
      toast({
        title: "No Credential type selected",
        description: "Please select an appropriate cred type to continue",
        status: "error",
      });
      return;
    }

    try {
      const action = OAuthActions[credType];

      const res = await action();

      if (res) {
        // TODO send to backend
        toast({
          title: "Credential added successfully",
          status: "success",
        });
      } else {
        toast({
          title: "Something went wrong",
          description: "Couldn`t complete OAuth flow",
          status: "error",
        });
      }
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Couldn`t complete OAuth flow",
        status: "error",
      });
    }
  };

  return (
    <>
      <Button ref={btnRef} onClick={onOpen} leftIcon={<AddIcon />}>
        Add
      </Button>

      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={btnRef}
        size="lg"
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Add new Credential</DrawerHeader>
          <DrawerBody>
            <FormControl isRequired>
              <FormLabel>Credential Type</FormLabel>
              <Menu colorScheme="gray">
                <MenuButton
                  w="100%"
                  as={Button}
                  rightIcon={<ChevronDownIcon />}
                >
                  Credential Type
                </MenuButton>
                <MenuList>
                  {CredentialTypeValues.map((type) => (
                    <MenuItem
                      onClick={() => setCredType(type)}
                      key={type}
                      w="620px"
                    >
                      <ThirdPartyAppChip type={type} />
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>
              <FormHelperText>
                Please select a Credential type to start OAuth flow
              </FormHelperText>
            </FormControl>

            {credType && (
              <>
                <Divider my={4} />
                <HStack>
                  <ThirdPartyAppChip type={credType} />
                  <Button
                    colorScheme="red"
                    onClick={() => setCredType(undefined)}
                  >
                    <CloseIcon />
                  </Button>
                </HStack>

                <Button
                  onClick={handleOAuthFlow}
                  mt={8}
                  w="100%"
                  variant="outline"
                >
                  START OAUTH FLOW
                </Button>
              </>
            )}
          </DrawerBody>

          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button>Add</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}

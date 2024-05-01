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
  Input,
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
import { useQueryClient } from "@tanstack/react-query";

const getGooglRedirectUrl = (
  type: TCredentialType,
  displayName: string,
  scope: string
) => {
  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.searchParams.set("redirect_uri", "https://on-events.vercel.app");
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", scope);
  url.searchParams.set("include_granted_scopes", "true");
  url.searchParams.set("state", type + "__" + displayName);
  url.searchParams.set("access_type", "offline");
  url.searchParams.set("prompt", "consent");
  url.searchParams.set(
    "client_id",
    "1014548543088-6gqr06fcf649jma2afhrao2obfkgqgq2.apps.googleusercontent.com"
  );

  return url;
};

export default function AddCredDrawer() {
  const qClient = useQueryClient();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [credType, setCredType] = useState<TCredentialType>();
  const [displayName, setDislplayname] = useState("");
  const btnRef = useRef<HTMLButtonElement>(null);
  const toast = useToast();

  const OAuthActions: Record<TCredentialType, () => Promise<boolean>> = {
    "discord:send-message": async () => {
      // TODO
      window.location.replace(
        "https://discord.com/oauth2/authorize?client_id=1223498118847402024&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000&scope=identify"
      );

      return true;
    },
    "gcalender:event-created": async () => {
      const url = getGooglRedirectUrl(
        "gcalender:event-created",
        displayName,
        "https://www.googleapis.com/auth/calendar.events.readonly"
      );
      window.location.replace(url);
      return true;
    },
    "gmail:send-mail": async () => {
      const url = getGooglRedirectUrl(
        "gmail:send-mail",
        displayName,
        "https://www.googleapis.com/auth/gmail.send"
      );
      window.location.replace(url);
      return true;
    },
    "gsheet:append-row": async () => {
      const url = getGooglRedirectUrl(
        "gsheet:append-row",
        displayName,
        "https://www.googleapis.com/auth/spreadsheets"
      );
      window.location.replace(url);
      return true;
    },
    "gmail:mail-received": async () => {
      const url = getGooglRedirectUrl(
        "gmail:mail-received",
        displayName,
        "TODO"
      );
      window.location.replace(url);
      return true;
    },
    "github:commit-received": async () => true,
  };

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
        qClient.invalidateQueries({ queryKey: ["workflows"] });
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
              <FormLabel>Display Name</FormLabel>
              <Input
                pattern="[0-9a-zA-Z]{1,32}"
                onChange={(e) => setDislplayname(e.target.value)}
                type="text"
                placeholder="eg. My Business Credential"
              />
              <FormHelperText>
                Please enter a name to help you identify this Credential
              </FormHelperText>
            </FormControl>

            <Divider py={2} />

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
                  isDisabled={!displayName || !credType}
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
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}

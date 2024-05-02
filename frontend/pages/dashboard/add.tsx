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
} from "@chakra-ui/react";
import { TriggerTypeValues } from "../../../common/schema";
import { CredTypeToImg, type TThirdPartyAppTypes } from "../../utils/credType";
import { useState } from "react";
import { TTriggerType } from "../../../src/db/schema";

export default function AddPage() {
  const { isOpen, onOpen, onClose } = useDisclosure({ defaultIsOpen: true });
  const [selected, setSelected] = useState<TTriggerType>();

  return (
    <Box>
      <Button onClick={onOpen}>Open Modal</Button>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent maxW="550px" minH="400px">
          <ModalHeader>Select a Trigger</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
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
                  borderColor='green.400'
                >
                  <Image
                  borderRadius='10px'
                    boxSize="55px"
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
          </ModalBody>

          <ModalFooter>
            <Button mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant="outline">Select</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

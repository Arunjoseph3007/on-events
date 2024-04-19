import { ArrowForwardIcon } from "@chakra-ui/icons";
import { Center, Text, Code, Button } from "@chakra-ui/react";
import { Link, useLocation } from "react-router-dom";

export default function NotFoundPage() {
  const { pathname } = useLocation();

  return (
    <Center flexDirection="column" h="100vh">
      <Text fontSize={150} fontWeight={900}>
        404
      </Text>
      <Text fontSize={20}>
        Route <Code colorScheme="gray">`{pathname}`</Code> could not be found
      </Text>
      <Link to="/">
        <Button mt={6} rightIcon={<ArrowForwardIcon />}>
          Home
        </Button>
      </Link>
    </Center>
  );
}

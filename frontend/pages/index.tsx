import { Button, Text, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function HomePage() {
  const [count, setCount] = useState(0);

  return (
    <VStack>
      <Button onClick={() => setCount((p) => p - 1)}>Dec -</Button>
      <Text>hi there {count}</Text>
      <Button onClick={() => setCount((p) => p + 1)}>+</Button>
      <Link to={"/page"}>page</Link>
    </VStack>
  );
}

import {
  ChakraProvider,
  extendTheme,
  withDefaultColorScheme,
} from "@chakra-ui/react";
import type { ReactNode } from "react";

const theme = extendTheme(withDefaultColorScheme({ colorScheme: "whatsapp" }));

export default function ChakraUIProvider({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ChakraProvider
      theme={theme}
      toastOptions={{
        defaultOptions: {
          position: "bottom-right",
          isClosable: true,
        },
      }}
    >
      {children}
    </ChakraProvider>
  );
}

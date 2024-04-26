import {
  ChakraProvider,
  extendTheme,
  withDefaultColorScheme,
} from "@chakra-ui/react";
import type { ReactNode } from "react";

const GlobalStyles = {
  global: {
    "::-webkit-scrollbar": {
      width: "10px",
    },
    "::-webkit-scrollbar-track": {
      background: "#f1f1f1cc",
      borderRadius: "100px",
    },
    "::-webkit-scrollbar-thumb": {
      background: "#ccc",
      borderRadius: "100px",
      ":hover": {
        background: "#aaa",
      },
    },
  },
};

const theme = extendTheme(withDefaultColorScheme({ colorScheme: "whatsapp" }), {
  styles: GlobalStyles,
});

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

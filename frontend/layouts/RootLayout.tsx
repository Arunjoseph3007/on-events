import { Outlet } from "react-router-dom";
import ChakraUIProvider from "../contexts/ChakraUIProvider";
import AuthContextProvider from "../contexts/auth";
import ReactQueryProvider from "../libs/reactQuery";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export default function RootLayout() {
  return (
    <ChakraUIProvider>
      <ReactQueryProvider>
        <AuthContextProvider>
          <ReactQueryDevtools position="right" />
          <Outlet />
        </AuthContextProvider>
      </ReactQueryProvider>
    </ChakraUIProvider>
  );
}

import { Outlet } from "react-router-dom";
import ChakraUIProvider from "../contexts/ChakraUIProvider";
import AuthContextProvider from "../contexts/auth";

export default function RootLayout() {
  return (
    <ChakraUIProvider>
      <AuthContextProvider>
        <Outlet />
      </AuthContextProvider>
    </ChakraUIProvider>
  );
}

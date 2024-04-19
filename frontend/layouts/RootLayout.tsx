import { Outlet } from "react-router-dom";
import ChakraUIProvider from "../contexts/ChakraUIProvider";

export default function RootLayout() {
  return (
    <ChakraUIProvider>
      <Outlet />
    </ChakraUIProvider>
  );
}

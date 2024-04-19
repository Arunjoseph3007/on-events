import { Box } from "@chakra-ui/react";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

export default function TopNavLayout() {
  return (
    <Box overflowX="hidden">
      <Navbar />
      <Outlet />
    </Box>
  );
}

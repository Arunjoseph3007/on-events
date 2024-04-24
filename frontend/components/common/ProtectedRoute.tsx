import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/auth";
import { Center, Spinner } from "@chakra-ui/react";

export default function ProtectedRoute() {
  const { loading, user, error } = useAuth();

  if (loading) {
    return (
      <Center w="100%" h="100%">
        <Spinner />
      </Center>
    );
  }

  if (error || !user) {
    return <Navigate to={"/login"} />;
  }

  return <Outlet />;
}

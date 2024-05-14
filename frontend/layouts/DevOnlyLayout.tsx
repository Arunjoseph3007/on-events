import { Navigate, Outlet } from "react-router-dom";

export default function DevOnlyLayout() {
  const isDev = process.env.NODE_ENV == "development";

  if (isDev) return <Outlet />;

  return <Navigate to="/404" replace={false} />;
}

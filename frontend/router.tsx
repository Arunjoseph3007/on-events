import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/common/ProtectedRoute";
// Pages
import HomePage from "./pages/index";
import NotFoundPage from "./pages/404";
import ErrorPage from "./pages/error";
import LoginPage from "./pages/login";
import SignupPage from "./pages/signup";
import DashboardPage from "./pages/dashboard/dashboard";
import WorkflowsPage from "./pages/dashboard/workflows";
import ExecutionsPage from "./pages/dashboard/executions";
import CredentialsPage from "./pages/dashboard/credentials";
import AddPage from "./pages/dashboard/add";
import SingleWorkflowPage from "./pages/dashboard/[workflowId]";
import EditWorkflowPage from "./pages/dashboard/[workflowId]/edit";
// Layouts
import RootLayout from "./layouts/RootLayout";
import TopNavLayout from "./layouts/TopNavLayout";
import SideNavLayout from "./layouts/SideNavLayout";

export default function Router() {
  return (
    <Routes>
      <Route errorElement={<ErrorPage />} element={<RootLayout />}>
        <Route element={<TopNavLayout />}>
          <Route index element={<HomePage />} />
          <Route element={<SideNavLayout />}>
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/workflows" element={<WorkflowsPage />} />
              <Route path="/executions" element={<ExecutionsPage />} />
              <Route path="/credentials" element={<CredentialsPage />} />
              <Route path="/add" element={<AddPage />} />
              <Route
                path="/workflows/:workflowId"
                element={<SingleWorkflowPage />}
              />
              <Route
                path="/workflows/:workflowId/edit"
                element={<EditWorkflowPage />}
              />
            </Route>
          </Route>
        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

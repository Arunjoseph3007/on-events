import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
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
import OAuthPage from "./pages/oauth";
import EmailPage from "./pages/email";
// Layouts
import RootLayout from "./layouts/RootLayout";
import TopNavLayout from "./layouts/TopNavLayout";
import SideNavLayout from "./layouts/SideNavLayout";
import DevOnlyLayout from "./layouts/DevOnlyLayout";
import DiagramProvider from "./contexts/DiagramEditorContext";

function Router() {
  return (
    <Routes>
      <Route errorElement={<ErrorPage />} element={<RootLayout />}>
        <Route path="/__dev__" element={<DevOnlyLayout />}>
          <Route path="email" element={<EmailPage />} />
        </Route>
        <Route element={<TopNavLayout />}>
          <Route index element={<HomePage />} />
          <Route element={<SideNavLayout />}>
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/workflows" element={<WorkflowsPage />} />
              <Route path="/executions" element={<ExecutionsPage />} />
              <Route path="/credentials" element={<CredentialsPage />} />
              <Route path="/add" element={<AddPage />} />
              <Route path="/oauth" element={<OAuthPage />} />
              <Route
                path="/workflows/:workflowId"
                element={<DiagramProvider />}
              >
                <Route index element={<SingleWorkflowPage />} />
                <Route path="edit" element={<EditWorkflowPage />} />
              </Route>
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

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Router />
    </BrowserRouter>
  </React.StrictMode>
);

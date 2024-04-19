import { Routes, Route } from "react-router-dom";
// Pages
import HomePage from "./pages/index";
import NotFoundPage from "./pages/404";
import ErrorPage from "./pages/error";
import LoginPage from "./pages/login";
import SignupPage from "./pages/signup";
// Layouts
import RootLayout from "./layouts/RootLayout";
import TopNavLayout from "./layouts/TopNavLayout";

export default function Router() {
  return (
    <Routes>
      <Route errorElement={<ErrorPage />} element={<RootLayout />}>
        <Route element={<TopNavLayout />}>
          <Route index element={<HomePage />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

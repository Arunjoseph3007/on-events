import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/index";
import Page from "./pages/page";
import RootLayout from "./layouts/RootLayout";
import NotFoundPage from "./pages/404";
import ErrorPage from "./pages/error";

export default function Router() {
  return (
    <Routes>
      <Route errorElement={<ErrorPage />} element={<RootLayout />}>
        <Route index element={<HomePage />} />
        <Route path="/page" element={<Page />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

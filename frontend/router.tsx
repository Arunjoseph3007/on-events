import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/index";
import Page from "./pages/page";

export default function Router() {
  return (
    <Routes>
      <Route index element={<HomePage />} />
      <Route path="/page" element={<Page />} />
    </Routes>
  );
}

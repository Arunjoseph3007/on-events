import { hydrateRoot } from "react-dom/client";
import React from "react";
import Router from "./router";
import { BrowserRouter } from "react-router-dom";

console.log("Hydration started...");

hydrateRoot(
  document.getElementById("app")!,
  <BrowserRouter>
    <Router />
  </BrowserRouter>
);

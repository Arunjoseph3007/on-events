import { hydrateRoot } from "react-dom/client";
import React from "react";
import App from "./app";

console.log("Hydration started...");

hydrateRoot(document.getElementById("app")!, <App />);

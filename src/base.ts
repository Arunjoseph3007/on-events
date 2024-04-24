import "dotenv/config";
import "./env";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import compression from "compression";
import playMiddleware from "./middlewares/play";
import { WorflowsRouter } from "./workflows/routes";
import { CredentialsRouter } from "./credentials/routes";
import { AccountsRouter } from "./accounts/routes";
import { setupPagination } from "./utils/pagination";
import { rateLimiter } from "./middlewares/ratelimit";

const app = express();
const api = "/api";

setupPagination(app);
// Middlewares
app.use(rateLimiter);
app.use(compression());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static("./public"));
app.use(playMiddleware);

// Health check route
app.get("/health", (_, res) => res.json({ hello: "world" }));

// Resource routers
app.use(api + AccountsRouter.path, AccountsRouter.router);
app.use(api + WorflowsRouter.path, WorflowsRouter.router);
app.use(api + CredentialsRouter.path, CredentialsRouter.router);

export default app;

import "dotenv/config";
import "./env";
import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import compression from "compression";
import playMiddleware from "./middlewares/play";
import { WorflowsRouter } from "./workflows/routes";
import { CredentialsRouter } from "./credentials/routes";
import { AccountsRouter } from "./accounts/routes";
import { setupPagination } from "./utils/pagination";
import { rateLimiter } from "./middlewares/ratelimit";
import { ExecutionsRouter } from "./executions/routes";
import errorHandlingMiddleware from "./middlewares/errorHandling";
import { frontendMiddelware } from "./middlewares/frontend";

const app = express();

setupPagination(app);
// Middlewares
app.use(compression());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static("./public"));
app.use(express.static("./frontend/dist"));
app.use(playMiddleware);

const router = express.Router();
router.use(rateLimiter);
router.get("/", (_, res) => res.json({ hello: "world" }));

// Resource routers
router.use(AccountsRouter.path, AccountsRouter.router);
router.use(WorflowsRouter.path, WorflowsRouter.router);
router.use(CredentialsRouter.path, CredentialsRouter.router);
router.use(ExecutionsRouter.path, ExecutionsRouter.router);

app.use("/api", router);
app.use("*", frontendMiddelware);
app.use(errorHandlingMiddleware);

export default app;

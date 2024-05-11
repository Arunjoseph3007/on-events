import "./env";
import express from "express";
// Middlewares
import morgan from "morgan";
import cookieParser from "cookie-parser";
import compression from "compression";
import { rateLimiter } from "./middlewares/ratelimit";
import { frontendMiddelware } from "./middlewares/frontend";
import errorHandlingMiddleware from "./middlewares/errorHandling";
import playMiddleware from "./middlewares/play";
import notFoundMiddleWare from "./middlewares/notFound";
// Custom express stuff
import setupResErrors from "./utils/resErrors";
import { setupPagination } from "./utils/pagination";
// Routers
import { ExecutionsRouter } from "./executions/routes";
import { CredentialsRouter } from "./credentials/routes";
import { AccountsRouter } from "./accounts/routes";
import { WorflowsRouter } from "./workflows/routes";

const app = express();

setupPagination(app);
setupResErrors(app);
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
router.use(notFoundMiddleWare);

app.use("/api", router);
app.use(frontendMiddelware);
app.use(errorHandlingMiddleware);

export default app;

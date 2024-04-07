import "./env";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { rateLimit } from "express-rate-limit";
import cookieParser from "cookie-parser";
import compression from "compression";
import notFoundMiddleWare from "./middlewares/notFound";
import errorHandlingMiddleware from "./middlewares/errorHandling";
import { WorflowsRouter } from "./workflows/routes";
import { CredentialsRouter } from "./credentials/routes";
import { AccountsRouter } from "./accounts/routes";

const app = express();

// Middlewares
app.use(rateLimit());
app.use(compression());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static("./public"));

// Health check route
app.get("/", (_, res) => res.json({ hello: "world" }));

// Resource routers
app.use(AccountsRouter.path, AccountsRouter.router);
app.use(WorflowsRouter.path, WorflowsRouter.router);
app.use(CredentialsRouter.path, CredentialsRouter.router);

// 404 - Not found route
app.use(notFoundMiddleWare);

// Exception handling
app.use(errorHandlingMiddleware);

export default app;

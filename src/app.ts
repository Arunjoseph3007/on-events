import "./env";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import notFoundMiddleWare from "./middlewares/notFound";
import errorHandlingMiddleware from "./middlewares/errorHandling";
import { WorflowsRouter } from "./workflows/routes";

const app = express();

// Middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("./public"));

// Health check route
app.get("/", (_, res) => res.json({ hello: "world" }));

// Resource routers
app.use(WorflowsRouter.path, WorflowsRouter.router);

// 404 - Not found route
app.use(notFoundMiddleWare);

// Exception handling
app.use(errorHandlingMiddleware);

export default app;

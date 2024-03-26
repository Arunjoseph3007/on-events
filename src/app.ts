import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import {
  IWebHooksPayload,
  GithubCommitWebhookController,
} from "./githubWebhooks";

const app = express();

// Middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Health check route
app.get("/", (req, res) => {
  res.json({ hello: "world1" });
});

app.post("/flows/:flowId", (req, res) => {
  const paylod = req.body as IWebHooksPayload;
  const flowId = req.params.flowId;

  GithubCommitWebhookController.handle(paylod, flowId);

  res.status(200).json({ succes: "full" });
});

// 404 - Not found route
app.use((req, res) => {
  res.status(404);

  res.json({
    error: "Not found",
    code: 404,
    route: req.path,
  });
});

// Exception handling
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({ message: err.message || "Something went wrong" });
});

export default app;

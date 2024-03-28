import express from "express";
import cors from "cors";
import morgan from "morgan";
import {
  IWebHooksPayload,
  GithubCommitWebhookController,
} from "./githubWebhooks";
import notFoundMiddleWare from "./middlewares/notFound";
import errorHandlingMiddleware from "./middlewares/errorHandling";

const app = express();

// Middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Health check route
app.get("/", (_, res) => res.json({ hello: "world" }));

app.post("/flows/:flowId", (req, res) => {
  const paylod = req.body as IWebHooksPayload;
  const flowId = req.params.flowId;

  GithubCommitWebhookController.handle(paylod, flowId);

  res.status(200).json({ succes: "full" });
});

// 404 - Not found route
app.use(notFoundMiddleWare);

// Exception handling
app.use(errorHandlingMiddleware);

export default app;

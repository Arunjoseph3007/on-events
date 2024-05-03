import { Router } from "express";
import { TRouter } from "../types/Router";
import { WorkflowsController } from "./controllers";
import { insertWorkflowSchema } from "./schemas";
import validate from "../middlewares/validateBody";
import { authenticateUser } from "../middlewares/authenticate";
import { workflows } from "../db/schema";
import { WorkflowQueries } from "./queries";
import { desc } from "drizzle-orm";
import pollAll from "../polling";

const router = Router();

router.post("/:workflowId/trigger", async (req, res) => {
  const result = await WorkflowsController.triggerWorkflow(
    +req.params.workflowId,
    req.body
  );

  res.json(result);
});

router.get("/poll", async (req, res) => {
  if (!req.headers.authorization) {
    return res.unauthorized();
  }
  const [bearer, cronSecret] = req.headers.authorization.split(" ");

  if (bearer != "Bearer" || cronSecret != process.env.CRON_SECRET) {
    return res.unauthorized();
  }

  const result = await pollAll();
  res.json(result);
});

router.use(authenticateUser);

router.get("/", async (req, res) => {
  const query = WorkflowQueries.workflowsOfUser(req.user.id);
  await res.paginateQuery(query, desc(workflows.createdAt));
});

router.get("/:workflowId", async (req, res) => {
  const workflow = await WorkflowsController.getWorkflowsById(
    +req.params.workflowId
  );
  res.json(workflow);
});

router.post("/", validate(insertWorkflowSchema), async (req, res) => {
  const workflow = await WorkflowsController.createWorkflow(
    req.body,
    req.user.id
  );
  res.json(workflow);
});

router.put("/:workflowId", async (req, res) => {
  const updated = await WorkflowsController.updateWorkflow(
    +req.params.workflowId
  );
  res.json(updated);
});

export const WorflowsRouter: TRouter = {
  path: "/workflows",
  router,
};

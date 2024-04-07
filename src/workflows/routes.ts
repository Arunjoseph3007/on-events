import { Router } from "express";
import { TRouter } from "../types/Router";
import { WorkflowsController } from "./controllers";
import { insertWorkflowSchema } from "./schemas";
import validate from "../middlewares/validateBody";
import { authenticateUser } from "../middlewares/authenticate";

const router = Router();

router.post("/:workflowId/trigger", async (req, res) => {
  const result = await WorkflowsController.triggerWorkflow(
    +req.params.workflowId,
    req.body
  );

  res.json(result);
});

router.use(authenticateUser);

router.get("/", async (req, res) => {
  const workflows = await WorkflowsController.getWorkflowsOfUser(req.user.id);
  res.json(workflows);
});

router.get("/:workflowId", async (req, res) => {
  const workflow = await WorkflowsController.getWorkflowsById(
    +req.params.workflowId
  );
  res.json(workflow);
});

router.post("/", validate(insertWorkflowSchema), async (req, res, next) => {
  try {
    const workflow = await WorkflowsController.createWorkflow(
      req.body,
      req.user.id
    );
    res.json(workflow);
  } catch (error) {
    next(error);
  }
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

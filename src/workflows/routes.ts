import { Router } from "express";
import { TRouter } from "../types/Router";
import { WorkflowsController } from "./controllers";
import { insertWorkflowSchema } from "./schemas";
import validate from "../middlewares/validateBody";

const router = Router();

router.get("/", async (req, res) => {
  const workflows = await WorkflowsController.getWorkflowsOfUser(2 as TODO);
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
      2 as TODO
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

router.all("/:workflowId/trigger", async (req, res) => {
  const result = await WorkflowsController.triggerWorkflow(
    +req.params.workflowId,
    req.body
  );

  res.json(result);
});

export const WorflowsRouter: TRouter = {
  path: "/workflows",
  router,
};

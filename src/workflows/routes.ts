import { Router } from "express";
import { TRouter } from "../types/Router";
import { WorkflowsController } from "./controllers";
import { insertWorkflowSchema } from "./schemas";

const router = Router();

router.get("/", async (req, res) => {
  const workflows = await WorkflowsController.getWorkflowsOfUser(2 as TODO);
  res.status(200).json(workflows);
});

router.get("/:workflowId", async (req, res) => {
  const workflow = await WorkflowsController.getWorkflowsById(
    +req.params.workflowId
  );
  res.status(200).json(workflow);
});

router.post("/", async (req, res, next) => {
  try {
    const body = insertWorkflowSchema.parse(req.body);

    const workflow = await WorkflowsController.createWorkflow(body, 2 as TODO);
    res.status(200).json(workflow);
  } catch (error) {
    next(error);
  }
});

router.put("/:workflowId", async (req, res) => {
  const updated = await WorkflowsController.updateWorkflow(
    +req.params.workflowId
  );
  res.status(200).json(updated);
});

router.all("/:workflowId/trigger", async (req, res) => {
  const result = await WorkflowsController.triggerWorkflow(
    +req.params.workflowId
  );

  res.status(200).json(result);
});

export const WorflowsRouter: TRouter = {
  path: "/workflows",
  router,
};

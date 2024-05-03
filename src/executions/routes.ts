import { Request, Router } from "express";
import { TRouter } from "../types/Router";
import { authenticateUser } from "../middlewares/authenticate";
import { ExecutionsController } from "./controllers";

const router = Router();

router.use(authenticateUser);

router.get("/", async (req: Request<{ page: number }>, res) => {
  const execRes = await ExecutionsController.getExecutions(
    req.user.id,
    req.params.page || 1
  );
  res.paginate(execRes);
});

export const ExecutionsRouter: TRouter = { path: "/executions", router };

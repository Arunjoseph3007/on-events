import { Router } from "express";
import type { TRouter } from "../types/Router";
import { CredentialsController } from "./controllers";
import { credTypeSchema, insertCredentialsSchema } from "./schema";
import { authenticateUser } from "../middlewares/authenticate";
import UnAuthorizedError from "../error/unauthorized";

const router = Router();

router.use(authenticateUser);

router.post("/", async (req, res, next) => {
  try {
    const payload = insertCredentialsSchema.parse(req.body);

    const created = await CredentialsController.create(payload, req.user.id);

    res.status(200).json(created);
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const creds = await CredentialsController.getCredentialsByUserId(
      req.user.id
    );

    res.status(200).json(creds);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const cred = await CredentialsController.getCredentialsById(+req.params.id);

    if (req.user.id != cred?.userId) {
      throw new UnAuthorizedError();
    }

    res.status(200).json(cred);
  } catch (error) {
    next(error);
  }
});

router.get("/type/:type", async (req, res) => {
  try {
    const type = credTypeSchema.parse(req.params.type);

    const creds = await CredentialsController.getCredentialsOfType(
      type,
      req.user.id
    );
    res.json(creds);
  } catch (error) {}
});

router.delete("/:id", async (req, res) => {});

export const CredentialsRouter: TRouter = {
  path: "/credentials",
  router,
};

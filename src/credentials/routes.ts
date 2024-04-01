import { Router } from "express";
import type { TRouter } from "../types/Router";
import { CredentialsController } from "./controllers";
import { insertCredentialsSchema } from "./schema";

const router = Router();

router.post("/", async (req, res, next) => {
  try {
    const payload = insertCredentialsSchema.parse(req.body);

    const created = await CredentialsController.create(payload, 2 as TODO);

    res.status(200).json(created);
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const creds = await CredentialsController.getCredentialsByUserId(2 as TODO);

    res.status(200).json(creds);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const cred = await CredentialsController.getCredentialsById(+req.params.id);

    res.status(200).json(cred);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res) => {});

export const CredentialsRouter: TRouter = {
  path: "/credentials",
  router,
};

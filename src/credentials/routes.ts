import { Router } from "express";
import type { TRouter } from "../types/Router";
import { CredentialsController } from "./controllers";
import { credTypeSchema, insertCredentialsSchema } from "./schema";
import { authenticateUser } from "../middlewares/authenticate";
import UnAuthorizedError from "../error/unauthorized";
import { credentials } from "../db/schema";
import { CredentialQuery } from "./queries";

const router = Router();

router.use(authenticateUser);

router.post("/", async (req, res) => {
  const payload = insertCredentialsSchema.parse(req.body);

  const created = await CredentialsController.create(payload, req.user.id);

  res.status(200).json(created);
});


router.get("/", async (req, res) => {
  const query = CredentialQuery.credentialsByUserId(req.user.id);
  await res.paginateQuery(query, credentials.id);
});

router.get("/:id", async (req, res) => {
  const cred = await CredentialsController.getCredentialsById(+req.params.id);

  if (req.user.id != cred?.userId) {
    throw new UnAuthorizedError();
  }

  res.status(200).json(cred);
});

router.get("/type/:type", async (req, res) => {
  const type = credTypeSchema.parse(req.params.type);
  const query = CredentialQuery.credentialsOfType(type, req.user.id);

  await res.paginateQuery(query, credentials.id);
});

router.delete("/:id", async (req, res) => {});

export const CredentialsRouter: TRouter = {
  path: "/credentials",
  router,
};

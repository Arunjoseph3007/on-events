import type { Request } from "express";
import { TTriggerController } from "../types/TriggerController";
import { TWorkflow, credentials } from "../db/schema";
import axios from "axios";
import db from "../db";
import { eq } from "drizzle-orm";

async function register(workflow: TWorkflow) {
  if (!workflow.triggerCredentialId) throw Error("Invalid credentials");

  const cred = await db.query.credentials.findFirst({
    where: eq(credentials.id, workflow.triggerCredentialId),
  });

  if (!cred) throw Error("Invaid credentials");

  const res = await axios.post(
    `https://www.googleapis.com/calendar/v3/calendars/${workflow.resourceId}/events/watch`,
    {
      id: workflow.id,
      type: "web_hook",
      address: `https://on-events.vercel.app/workflows/${workflow.id}/trigger`,
    },
    {
      headers: {
        Authorization: "Bearer " + cred.accessToken,
      },
    }
  );
}

async function deleteWebhook(workflow: TWorkflow) {
  if (!workflow.triggerCredentialId) {
    throw new Error("Invalid credentials");
  }

  const cred = await db.query.credentials.findFirst({
    where: eq(credentials.id, workflow.triggerCredentialId),
  });

  if (!cred) {
    throw new Error("Invaid credentials");
  }
}

async function handle(req: Request) {}

export const GCalenderEventsTriggerController: TTriggerController = {
  delete: deleteWebhook,
  register,
  handle,
};

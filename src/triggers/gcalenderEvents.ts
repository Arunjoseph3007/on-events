import type { Request } from "express";
import { TTriggerController } from "../types/TriggerController";
import { TWorkflow, credentials, workflows } from "../db/schema";
import axios from "axios";
import db from "../db";
import { eq } from "drizzle-orm";
import { googleGrantAccessToken } from "../credentials/utils";

async function register(workflow: TWorkflow) {
  if (!workflow.triggerCredentialId) {
    throw Error("Invalid credentials");
  }

  const cred = await db.query.credentials.findFirst({
    where: eq(credentials.id, workflow.triggerCredentialId),
  });

  if (!cred) {
    throw Error("Invaid credentials");
  }

  const access_token = await googleGrantAccessToken(cred.accessToken);

  const res = await axios.post(
    `https://www.googleapis.com/calendar/v3/calendars/${workflow.resourceId}/events/watch`,
    {
      id: workflow.id,
      type: "web_hook",
      address: `https://on-events.vercel.app/workflows/${workflow.id}/trigger`,
    },
    {
      headers: {
        Authorization: "Bearer " + access_token,
      },
    }
  );

  await db.update(workflows).set({
    webHookId: res.data.resourceId,
  });
}

async function list() {
  const cred = await db.query.credentials.findFirst({
    where: eq(credentials.id, 9),
  });

  const access_token = await googleGrantAccessToken(cred!.accessToken);

  const res = await axios.get(
    "https://www.googleapis.com/calendar/v3/calendars/arunjoseph3007@gmail.com/events",
    {
      headers: {
        Authorization: "Bearer " + access_token,
      },
    }
  );
}

async function deleteWebhook(workflow: TWorkflow) {
  if (!workflow.triggerCredentialId) throw Error("Invalid credentials");

  const cred = await db.query.credentials.findFirst({
    where: eq(credentials.id, workflow.triggerCredentialId),
  });

  if (!cred) throw Error("Invaid credentials");

  const access_token = await googleGrantAccessToken(cred.accessToken);

  const res = await axios.post(
    "https://www.googleapis.com/calendar/v3/channels/stop",
    {
      id: workflow.id,
      resourceId: workflow.webHookId,
    },
    {
      headers: {
        Authorization: "Bearer " + access_token,
      },
    }
  );

  console.log(res.data);
}

async function handle(req: Request) {}

export const GCalenderEventsTriggerController: TTriggerController = {
  delete: deleteWebhook,
  register,
  handle,
};

register({
  id: 0,
  triggerCredentialId: 9,
  resourceId: "arunjoseph3007@gmail.com",
  createdAt: new Date(),
  isActive: true,
  name: "",
  triggerType: "gcalender:event-created",
  userId: 6,
  webHookId: "",
});

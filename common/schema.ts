export const TriggerTypeValues = [
  "github:commit-received",
  "gmail:mail-received",
  "gcalender:event-created",
] as const;

export const EventTypeValues = [
  "gmail:send-mail",
  "gsheet:append-row",
  "discord:send-message",
] as const;

export const CredentialTypeValues = [
  ...TriggerTypeValues,
  ...EventTypeValues,
] as const;

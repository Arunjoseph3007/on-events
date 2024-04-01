import sendEmail from "./sendEmail";

export const GmailActions = { sendEmail };

export type TSendEmailConfig = {
  to: string;
  from: string;
  subject: string;
  content: string;
};

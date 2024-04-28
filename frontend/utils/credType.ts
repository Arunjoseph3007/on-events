import type { TCredentialType } from "../../src/db/schema";

export type TThirdPartyAppTypes =
  TCredentialType extends `${infer THead}:${infer TTail}` ? THead : never;

// TODO : replace with my own images
export const CredTypeToImg: Record<TThirdPartyAppTypes, string> = {
  gcalender:
    "https://static-00.iconduck.com/assets.00/google-calendar-icon-2048x2048-2mlvsa6u.png",
  github: "https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png",
  gmail: "https://logowik.com/content/uploads/images/gmail-new-icon5198.jpg",
  discord:
    "https://thumbs.dreamstime.com/b/vinnytsia-ukraine-may-discord-social-logotype-flat-style-media-icon-can-be-used-web-mobile-ui-vector-illustration-279761436.jpg",
  gsheet:
    "https://static.vecteezy.com/system/resources/previews/017/395/369/original/google-sheets-apps-logo-free-png.png",
};

export const CredTypeToHelperText: Record<TCredentialType, string> = {
  "discord:send-message":
    "Id of the channel that you want the message to be sent",
  "gcalender:event-created": "Id of the calender which you want to listen",
  "github:commit-received": "Repository name. eg 'facebook/react'",
  "gmail:mail-received":
    "Email Id of the person you want to send. eg john.doe@gmail.com",
  "gmail:send-mail":
    "Email Id on which you want to listen. eg john.doe@gmail.com",
  "gsheet:append-row": "Google sheet Id",
};

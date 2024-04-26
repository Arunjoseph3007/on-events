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

import type { TCredentialType } from "../../../src/db/schema";
import { Button, Image } from "@chakra-ui/react";

type TBeforeSemi = TCredentialType extends `${infer THead}:${infer TTail}`
  ? THead
  : never;

// TODO : replace with my own images
const CredTypeToImg: Record<TBeforeSemi, string> = {
  gcalender:
    "https://static-00.iconduck.com/assets.00/google-calendar-icon-2048x2048-2mlvsa6u.png",
  github: "https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png",
  gmail: "https://logowik.com/content/uploads/images/gmail-new-icon5198.jpg",
  discord:
    "https://thumbs.dreamstime.com/b/vinnytsia-ukraine-may-discord-social-logotype-flat-style-media-icon-can-be-used-web-mobile-ui-vector-illustration-279761436.jpg",
  gsheet:
    "https://static.vecteezy.com/system/resources/previews/017/395/369/original/google-sheets-apps-logo-free-png.png",
};

export default function ThirdPartyAppChip({ type }: { type: TCredentialType }) {
  const [app, event] = type.split(":");

  return (
    <Button
      w="100%"
      justifyContent="flex-start"
      colorScheme="gray"
      textTransform="capitalize"
      leftIcon={
        <Image
          boxSize="30px"
          blendMode="multiply"
          objectFit="cover"
          src={CredTypeToImg[app as TBeforeSemi] || "/logo.png"}
          alt={app}
        />
      }
    >
      {event.replace("-", " ")}
    </Button>
  );
}

import type { TCredentialType } from "../../../src/db/schema";
import { Button, Image, type ButtonProps } from "@chakra-ui/react";
import {
  CredTypeToImg,
  type TThirdPartyAppTypes,
} from "../../utils/credTypeToImg";

export default function ThirdPartyAppChip({
  type,
  btnProps = {},
}: {
  type: TCredentialType;
  btnProps?: ButtonProps;
}) {
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
          src={CredTypeToImg[app as TThirdPartyAppTypes] || "/logo.png"}
          alt={app}
        />
      }
      {...btnProps}
    >
      {event.replace("-", " ")}
    </Button>
  );
}

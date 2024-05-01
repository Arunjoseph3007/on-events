import {
  Button,
  Center,
  Image,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { CredTypeToImg, TThirdPartyAppTypes } from "../utils/credType";
import { CredentialsIcon } from "../icons/credentials";
import { useMutation } from "@tanstack/react-query";
import type { TCredential } from "../../src/db/schema";
import axios from "../libs/axios";
import { AxiosError } from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function OAuthPage() {
  const toast = useToast();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const provider = "github" as TThirdPartyAppTypes;
  const imageSrc = CredTypeToImg[provider] || "/logo.png";
  const saveCredMutation = useMutation<
    TCredential,
    AxiosError,
    Omit<TCredential, "userId" | "id" | "expiry">
  >({
    mutationFn: async (data) => {
      const res = await axios.post<TCredential>("/credentials", data);

      return res.data;
    },
    onError() {
      toast({
        title: "Error in saving credential",
        status: "error",
      });
    },
    onSuccess() {
      toast({
        title: "Credential saved successfully",
        status: "success",
      });
      navigate("/credentials");
    },
  });

  const handleSaveCred = async () => {
    const accessToken = params.get("code")!;
    const [credentialType, displayName] = params.get("state")!.split("__");

    saveCredMutation.mutate({
      accessToken,
      clientId: "",
      credentialType: credentialType as any,
      displayName,
    });
  };

  return (
    <Center w="100%" h="1--%">
      <VStack gap={10}>
        <Image
          boxSize="250px"
          objectFit="cover"
          blendMode="difference"
          boxShadow="2xl"
          borderRadius="1000px"
          src={imageSrc}
          alt="google"
        />
        <Text fontSize="2xl" fontWeight={700}>
          Click here to save OAuth credential
        </Text>
        <Button
          w="250px"
          size="lg"
          leftIcon={<CredentialsIcon boxSize={6} />}
          onClick={handleSaveCred}
        >
          Save credential
        </Button>
      </VStack>
    </Center>
  );
}

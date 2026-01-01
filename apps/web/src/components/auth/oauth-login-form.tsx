"use client";

import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/toast";
import { authClient } from "@/utils/auth-client";
import Loader from "@/components/ui/loader";
import { Button } from "@/components/ui/button";

export default function OAuthLoginForm() {
  const router = useRouter();
  const { isPending } = authClient.useSession();

  const handleKeycloakLogin = async () => {
    await authClient.signIn.social(
      {
        provider: "keycloak",
        callbackURL: "/",
      },
      {
        onSuccess: () => {
          router.push("/");
          toast.success("Sign in successful");
        },
        onError: (error) => {
          toast.error(error.error.message || error.error.statusText);
        },
      },
    );
  };

  if (isPending) {
    return <Loader />;
  }

  return (
    <div className="mx-auto w-full mt-10 max-w-md p-6">
      <h1 className="mb-6 text-center text-3xl font-bold">Welcome</h1>
      <p className="mb-8 text-center text-muted-foreground">
        Sign in to your account using Keycloak
      </p>

      <Button onPress={handleKeycloakLogin} className="w-full">
        Sign in with Keycloak
      </Button>
    </div>
  );
}

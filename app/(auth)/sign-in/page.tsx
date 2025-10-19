"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { useAuthError } from "@/lib/use-auth-error";
import { SignInForm } from "./form";
import { createSignInSchema, type SignInFormData } from "./types";

export default function SignInPage() {
  const router = useRouter();

  const translate = useTranslations("validation");
  const { getAuthErrorMessage } = useAuthError();
  const signInSchema = createSignInSchema(translate);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    mode: "onSubmit",
    reValidateMode: "onBlur",
  });

  const onSubmit = async ({ email, password }: SignInFormData) => {
    const { error } = await authClient.signIn.email(
      {
        email,
        password,
        rememberMe: true,
      },
      {
        onSuccess: () => {
          router.push("/dashboard");
        },
      },
    );

    if (error) {
      toast.error(getAuthErrorMessage(error.code));
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <SignInForm
        onSubmit={handleSubmit(onSubmit)}
        register={register}
        errors={errors}
        isSubmitting={isSubmitting}
      />
    </main>
  );
}

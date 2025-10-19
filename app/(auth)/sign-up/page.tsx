"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { useAuthError } from "@/lib/use-auth-error";
import { SignUpForm } from "./form";
import { createSignUpSchema, type SignUpFormData } from "./types";

export default function SignUpPage() {
  const router = useRouter();

  const translate = useTranslations("validation");
  const { getAuthErrorMessage } = useAuthError();
  const signUpSchema = createSignUpSchema(translate);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    mode: "onSubmit",
    reValidateMode: "onBlur",
  });

  const onSubmit = async ({ email, password }: SignUpFormData) => {
    const { error } = await authClient.signUp.email(
      {
        // TODO: Add name field to the form
        name: email,
        email,
        password,
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
      <SignUpForm
        onSubmit={handleSubmit(onSubmit)}
        register={register}
        errors={errors}
        isSubmitting={isSubmitting}
      />
    </main>
  );
}

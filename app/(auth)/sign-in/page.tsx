"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { SignInForm } from "./form";
import { createSignInSchema, type SignInFormData } from "./types";

export default function SignInPage() {
  const translate = useTranslations("validation");
  const signInSchema = createSignInSchema(translate);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    mode: "onSubmit",
  });

  const onSubmit = async (data: SignInFormData) => {
    // Handle login logic here
    console.log("Login attempt:", data);
    // Backend integration to be implemented later
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

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { SignUpForm } from "./form";
import { createSignUpSchema, type SignUpFormData } from "./types";

export default function SignUpPage() {
  const translate = useTranslations("validation");
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

  const onSubmit = async (data: SignUpFormData) => {
    // Handle sign up logic here
    console.log("Sign up attempt:", data);
    // Backend integration to be implemented later
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

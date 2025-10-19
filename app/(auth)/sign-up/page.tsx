"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { SignUpForm } from "./form";
import { signUpSchema, type SignUpFormData } from "./types";

export default function SignUpPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    mode: "onSubmit",
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

"use client";

import type React from "react";
import { useState } from "react";
import { toast } from "sonner";
import { type RegisterInput, registerSchema } from "@/app/register/types";
import { RegisterForm } from "@/components/register-form";
import { authClient } from "@/lib/auth/client";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const passwordMatch = password === passwordRepeat;
    if (!passwordMatch) {
      toast.error("Passwords do not match");
      return;
    }

    const data: RegisterInput = {
      email,
      password,
      passwordRepeat,
    };

    const result = registerSchema.safeParse(data);
    if (!result.success) {
      alert("Invalid input");
      return;
    }

    await authClient.signUp.email(
      {
        email: data.email,
        password: data.password,
        name: data.email,
      },
      {
        onSuccess: () => {
          toast.success("Account created successfully");
        },
        onError: (error) => {
          console.error("Error signing up:", error);
          toast.error("Error signing up");
        },
      },
    );
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <RegisterForm
        email={email}
        password={password}
        passwordRepeat={passwordRepeat}
        onEmailChange={setEmail}
        onPasswordChange={setPassword}
        onPasswordRepeatChange={setPasswordRepeat}
        onSubmit={handleSubmit}
      />
    </main>
  );
}

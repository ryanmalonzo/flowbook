"use client";

import type React from "react";
import { useState } from "react";
import { toast } from "sonner";
import { type LoginInput, loginSchema } from "@/app/login/types";
import { LoginForm } from "@/components/login-form";
import { authClient } from "@/lib/auth/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailChange = (email: string) => {
    setEmail(email);
  };

  const handlePasswordChange = (password: string) => {
    setPassword(password);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data: LoginInput = {
      email,
      password,
    };

    const result = loginSchema.safeParse(data);
    if (!result.success) {
      toast.error("Invalid input");
      return;
    }

    await authClient.signIn.email(
      {
        email: data.email,
        password: data.password,
      },
      {
        onSuccess: () => {
          toast.success("Signed in successfully");
        },
        onError: (error) => {
          console.error("Error signing in:", error);
          toast.error("Error signing in");
        },
      },
    );
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <LoginForm
        email={email}
        password={password}
        onEmailChange={handleEmailChange}
        onPasswordChange={handlePasswordChange}
        onSubmit={handleSubmit}
      />
    </main>
  );
}

"use client";

import Link from "next/link";
import type React from "react";
import { useState } from "react";
import { type RegisterInput, registerSchema } from "@/app/register/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth/client";

export function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const passwordMatch = password === passwordRepeat;
    if (!passwordMatch) {
      alert("Passwords do not match");
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
        name: "ren",
      },
      {
        onSuccess: () => {
          console.log("Signed up successfully");
        },
        onError: (error) => {
          console.error("Error signing up:", error);
          alert("Error signing up");
        },
      },
    );
  };

  return (
    <div className="w-full max-w-sm">
      <h1 className="text-4xl font-bold text-foreground mb-8 text-center">
        Flowbook
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label
            htmlFor="email"
            className="text-sm font-medium text-foreground"
          >
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full"
            autoComplete="email"
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="password"
            className="text-sm font-medium text-foreground"
          >
            Password
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full"
            autoComplete="new-password"
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="passwordRepeat"
            className="text-sm font-medium text-foreground"
          >
            Repeat Password
          </Label>
          <Input
            id="passwordRepeat"
            type="password"
            placeholder="Repeat your password"
            value={passwordRepeat}
            onChange={(e) => setPasswordRepeat(e.target.value)}
            required
            autoComplete="new-password"
          />
        </div>

        <Button type="submit" className="w-full">
          Sign up
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-foreground hover:underline"
          >
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}

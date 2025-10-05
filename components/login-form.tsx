"use client";

import Link from "next/link";
import type React from "react";
import { useState } from "react";
import { type LoginInput, loginSchema } from "@/app/login/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth/client";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data: LoginInput = {
      email,
      password,
    };

    const result = loginSchema.safeParse(data);
    if (!result.success) {
      alert("Invalid input");
    }

    await authClient.signIn.email(
      {
        email: data.email,
        password: data.password,
      },
      {
        onError: () => {
          console.log("Error signing in");
        },
        onSuccess: () => {
          console.log("Signed in successfully");
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
            autoComplete="current-password"
          />
        </div>

        <Button type="submit" className="w-full">
          Sign in
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Need an account?{" "}
          <Link
            href="/register"
            className="font-medium text-foreground hover:underline"
          >
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}

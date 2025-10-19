"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SignInForm() {
  const t = useTranslations();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log("Login attempt:", { email, password });
  };

  return (
    <div className="w-full max-w-sm">
      <h1 className="text-4xl font-bold text-foreground mb-8 text-center">
        {t("common.appName")}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label
            htmlFor="email"
            className="text-sm font-medium text-foreground"
          >
            {t("signIn.form.email.label")}
          </Label>
          <Input
            type="email"
            placeholder={t("signIn.form.email.placeholder")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required={true}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="password"
            className="text-sm font-medium text-foreground"
          >
            {t("signIn.form.password.label")}
          </Label>
          <Input
            type="password"
            placeholder={t("signIn.form.password.placeholder")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required={true}
            className="w-full"
          />
        </div>

        <Button type="submit" className="w-full">
          {t("signIn.form.submit")}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          {t("signIn.noAccount")}
          <Link
            href="/sign-up"
            className="font-medium text-foreground hover:underline"
          >
            {t("signIn.signUp")}
          </Link>
        </p>
      </form>
    </div>
  );
}

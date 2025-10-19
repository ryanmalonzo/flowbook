"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SignUpForm() {
  const t = useTranslations();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle sign up logic here
    console.log("Sign up attempt:", { email, password });
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
            {t("signUp.form.email.label")}
          </Label>
          <Input
            type="email"
            placeholder={t("signUp.form.email.placeholder")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required={true}
            className="w-full"
            autoComplete="email"
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="password"
            className="text-sm font-medium text-foreground"
          >
            {t("signUp.form.password.label")}
          </Label>
          <Input
            type="password"
            placeholder={t("signUp.form.password.placeholder")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required={true}
            className="w-full"
            autoComplete="new-password"
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="passwordConfirm"
            className="text-sm font-medium text-foreground"
          >
            {t("signUp.form.passwordConfirm.label")}
          </Label>
          <Input
            type="password"
            placeholder={t("signUp.form.passwordConfirm.placeholder")}
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            required={true}
            className="w-full"
            autoComplete="new-password"
          />
        </div>

        <Button type="submit" className="w-full">
          {t("signUp.form.submit")}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          {t("signUp.existingAccount")}
          <Link
            href="/sign-in"
            className="font-medium text-foreground hover:underline"
          >
            {t("signUp.signIn")}
          </Link>
        </p>
      </form>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useId } from "react";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { SignInFormData } from "./types";

interface SignInFormProps {
  onSubmit: (e: React.FormEvent) => void;
  register: UseFormRegister<SignInFormData>;
  errors: FieldErrors<SignInFormData>;
  isSubmitting: boolean;
}

export function SignInForm({
  onSubmit,
  register,
  errors,
  isSubmitting,
}: SignInFormProps) {
  const t = useTranslations();

  const emailId = useId();
  const passwordId = useId();

  return (
    <div className="w-full max-w-sm">
      <h1 className="mb-8 text-center font-bold text-4xl text-foreground">
        {t("common.appName")}
      </h1>

      <form onSubmit={onSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label
            htmlFor={emailId}
            className="font-medium text-foreground text-sm"
          >
            {t("signIn.form.email.label")}
          </Label>
          <Input
            id={emailId}
            type="email"
            placeholder={t("signIn.form.email.placeholder")}
            {...register("email")}
            className="w-full"
            autoComplete="email"
          />
          {errors.email && (
            <p className="text-destructive text-sm">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor={passwordId}
            className="font-medium text-foreground text-sm"
          >
            {t("signIn.form.password.label")}
          </Label>
          <Input
            id={passwordId}
            type="password"
            placeholder={t("signIn.form.password.placeholder")}
            {...register("password")}
            className="w-full"
            autoComplete="current-password"
          />
          {errors.password && (
            <p className="text-destructive text-sm">
              {errors.password.message}
            </p>
          )}
        </div>

        <Button type="submit" className="w-full" loading={isSubmitting}>
          {t("signIn.form.submit")}
        </Button>

        <p className="text-center text-muted-foreground text-sm">
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

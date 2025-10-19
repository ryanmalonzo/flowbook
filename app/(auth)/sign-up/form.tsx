"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useId } from "react";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { SignUpFormData } from "./types";

interface SignUpFormProps {
  onSubmit: (e: React.FormEvent) => void;
  register: UseFormRegister<SignUpFormData>;
  errors: FieldErrors<SignUpFormData>;
  isSubmitting: boolean;
}

export function SignUpForm({
  onSubmit,
  register,
  errors,
  isSubmitting,
}: SignUpFormProps) {
  const t = useTranslations();

  const emailId = useId();
  const passwordId = useId();
  const passwordConfirmId = useId();

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
            {t("signUp.form.email.label")}
          </Label>
          <Input
            id={emailId}
            type="email"
            placeholder={t("signUp.form.email.placeholder")}
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
            {t("signUp.form.password.label")}
          </Label>
          <Input
            id={passwordId}
            type="password"
            placeholder={t("signUp.form.password.placeholder")}
            {...register("password")}
            className="w-full"
            autoComplete="new-password"
          />
          {errors.password && (
            <p className="text-destructive text-sm">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor={passwordConfirmId}
            className="font-medium text-foreground text-sm"
          >
            {t("signUp.form.passwordConfirm.label")}
          </Label>
          <Input
            id={passwordConfirmId}
            type="password"
            placeholder={t("signUp.form.passwordConfirm.placeholder")}
            {...register("passwordConfirm")}
            className="w-full"
            autoComplete="new-password"
          />
          {errors.passwordConfirm && (
            <p className="text-destructive text-sm">
              {errors.passwordConfirm.message}
            </p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {t("signUp.form.submit")}
        </Button>

        <p className="text-center text-muted-foreground text-sm">
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

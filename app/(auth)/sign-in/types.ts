import { z } from "zod";
import type { useTranslations } from "next-intl";

export const createSignInSchema = (
  translate: ReturnType<typeof useTranslations<"validation">>
) =>
  z.object({
    email: z
      .email(translate("email.invalid"))
      .min(1, translate("email.required")),
    password: z.string().min(1, translate("password.required")),
  });

export type SignInFormData = z.infer<ReturnType<typeof createSignInSchema>>;

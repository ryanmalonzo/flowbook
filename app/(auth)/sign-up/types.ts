import type { useTranslations } from "next-intl";
import { z } from "zod";

const MIN_PASSWORD_LENGTH = 8;

export const createSignUpSchema = (
  translate: ReturnType<typeof useTranslations<"validation">>,
) =>
  z
    .object({
      email: z
        .email(translate("email.invalid"))
        .min(1, translate("email.required")),
      password: z
        .string()
        .min(
          MIN_PASSWORD_LENGTH,
          translate("password.minLength", { min: MIN_PASSWORD_LENGTH }),
        )
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
          translate("password.requirements"),
        ),
      passwordConfirm: z.string().min(1, translate("passwordConfirm.required")),
    })
    .refine((data) => data.password === data.passwordConfirm, {
      message: translate("passwordConfirm.noMatch"),
      path: ["passwordConfirm"],
    });

export type SignUpFormData = z.infer<ReturnType<typeof createSignUpSchema>>;

import { z } from "zod";
import type { useTranslations } from "next-intl";

export const createSignUpSchema = (
  translate: ReturnType<typeof useTranslations<"validation">>
) =>
  z
    .object({
      email: z
        .string()
        .min(1, translate("email.required"))
        .email(translate("email.invalid")),
      password: z
        .string()
        .min(8, translate("password.minLength", { min: 8 }))
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
          translate("password.requirements")
        ),
      passwordConfirm: z.string().min(1, translate("passwordConfirm.required")),
    })
    .refine((data) => data.password === data.passwordConfirm, {
      message: translate("passwordConfirm.noMatch"),
      path: ["passwordConfirm"],
    });

export type SignUpFormData = z.infer<ReturnType<typeof createSignUpSchema>>;

import { z } from "zod";

export const registerSchema = z
  .object({
    email: z.email(),
    password: z.string().min(8),
    passwordRepeat: z.string().min(8),
  })
  .refine((v) => v.password === v.passwordRepeat, {
    message: "Passwords must match",
    path: ["passwordRepeat"],
  });

export type RegisterInput = z.infer<typeof registerSchema>;

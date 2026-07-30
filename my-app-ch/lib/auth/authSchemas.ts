import { z } from "zod";
// ── Client-side validation ──────────────────────────────────────────────
// This is a UX layer only — it makes forms give instant feedback and
// cuts down on obviously-invalid requests hitting the API. It is NOT a
// security boundary: the backend must independently re-validate every
// field (per your swagger spec, it already does — 400 on weak
// password/short username/invalid email). Never assume client
// validation passing means the data is safe; an attacker can call the
// API directly and skip this file entirely.
//
// Password rule below mirrors the example "StrongP@ssw0rd1" (upper +
// lower + digit + special char, 8+ chars) — confirm the exact policy
// against your backend's actual validator so the two never disagree.

const passwordSchema = z
  .string()
  .min(8, "رمز عبور باید حداقل ۸ کاراکتر باشد")
  .regex(/[a-z]/, "رمز عبور باید شامل حرف کوچک باشد")
  .regex(/[A-Z]/, "رمز عبور باید شامل حرف بزرگ باشد")
  .regex(/[0-9]/, "رمز عبور باید شامل عدد باشد")
  .regex(/[^A-Za-z0-9]/, "رمز عبور باید شامل کاراکتر خاص باشد");

const iranianPhoneSchema = z
  .string()
  .regex(/^09\d{9}$/, "شماره موبایل معتبر نیست");

export const registerSchema = z
  .object({
    name: z.string().min(2, "نام خود را وارد کنید"),
    email: z.string().email("ایمیل معتبر نیست"),
    username: z
      .string()
      .min(4, "نام کاربری باید حداقل ۴ کاراکتر باشد")
      .max(20, "نام کاربری خیلی طولانی است")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "نام کاربری فقط می‌تواند شامل حروف، عدد و _ باشد",
      ),
    phoneNumber: iranianPhoneSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
    terms: z.literal(true, { message: "پذیرش قوانین الزامی است" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "رمز عبور و تکرار آن یکسان نیستند",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  phoneNumber: iranianPhoneSchema,
  password: z.string().min(1, "رمز عبور را وارد کنید"),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;
export type LoginFormValues = z.infer<typeof loginSchema>;

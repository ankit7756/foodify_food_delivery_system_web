import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().email({ message: "Invalid email address!" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

export const registerSchema = z.object({
    username: z.string().min(3, { message: "Username must be at least 3 characters" }),
    fullName: z.string().min(2, { message: "Full name must be at least 2 characters" }),
    phone: z.string().min(10, { message: "Phone number must be at least 10 digits" }),
    email: z.string().email({ message: "Invalid email address!" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

// ✅ NEW SCHEMAS
export const forgetPasswordSchema = z.object({
    email: z.string().email({ message: "Enter a valid email" }),
});

export const resetPasswordSchema = z.object({
    newPassword: z.string().min(6, { message: "Minimum 6 characters" }),
    confirmNewPassword: z.string().min(6, { message: "Minimum 6 characters" }),
}).refine((v) => v.newPassword === v.confirmNewPassword, {
    path: ["confirmNewPassword"],
    message: "Passwords do not match",
});

export type LoginData = z.infer<typeof loginSchema>;
export type RegisterData = z.infer<typeof registerSchema>;
export type ForgetPasswordData = z.infer<typeof forgetPasswordSchema>;
export type ResetPasswordData = z.infer<typeof resetPasswordSchema>;
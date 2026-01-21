// import { z } from "zod";

// export const loginSchema = z.object({
//     email: z.string().email({ message: "Invalid email address!" }),
//     password: z.string().min(6, { message: "Password must be at least 6 characters" }),
// });

// export const registerSchema = z.object({
//     name: z.string().min(2, { message: "Name must be at least 2 characters" }),
//     email: z.string().email({ message: "Invalid email address!" }),
//     password: z.string().min(6, { message: "Password must be at least 6 characters" }),
//     confirmPassword: z.string(),
// }).refine((data) => data.password === data.confirmPassword, {
//     message: "Passwords do not match",
//     path: ["confirmPassword"],
// });

// export type LoginData = z.infer<typeof loginSchema>;
// export type RegisterData = z.infer<typeof registerSchema>;

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

export type LoginData = z.infer<typeof loginSchema>;
export type RegisterData = z.infer<typeof registerSchema>;
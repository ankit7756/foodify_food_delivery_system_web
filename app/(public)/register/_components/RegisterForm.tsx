"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { registerSchema, RegisterData } from "@/app/schemas/auth.schema";

export default function RegisterForm() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegisterData>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = (data: RegisterData) => {
        startTransition(async () => {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            console.log("Register submitted:", data);
            router.push("/auth/dashboard");
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium">
                    Full Name
                </label>
                <input
                    {...register("name")}
                    type="text"
                    id="name"
                    placeholder="Lionel Messi"
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-foreground/50"
                />
                {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium">
                    Email
                </label>
                <input
                    {...register("email")}
                    type="email"
                    id="email"
                    placeholder="you@example.com"
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-foreground/50"
                />
                {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium">
                    Password
                </label>
                <input
                    {...register("password")}
                    type="password"
                    id="password"
                    placeholder="••••••••"
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-foreground/50"
                />
                {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
            </div>

            <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-sm font-medium">
                    Confirm Password
                </label>
                <input
                    {...register("confirmPassword")}
                    type="password"
                    id="confirmPassword"
                    placeholder="••••••••"
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-foreground/50"
                />
                {errors.confirmPassword && (
                    <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>
                )}
            </div>

            <button
                type="submit"
                disabled={isSubmitting || isPending}
                className="w-full py-3 bg-foreground text-background rounded-md font-semibold disabled:opacity-60"
            >
                {isPending ? "Creating account..." : "Sign up"}
            </button>

            <p className="text-center text-sm">
                Already have an account?{" "}
                <Link href="/login" className="font-semibold hover:underline">
                    Log in
                </Link>
            </p>
        </form>
    );
}
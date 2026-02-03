"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { loginSchema, LoginData } from "../schema";
import { handleLogin } from "@/app/lib/actions/auth-action";
import { Eye, EyeOff, Mail, Lock, Loader2 } from "lucide-react";

export default function LoginForm() {
    const router = useRouter();
    const [error, setError] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginData) => {
        setIsLoading(true);
        setError("");

        try {
            console.log("🔵 Submitting login..."); // Debug
            const result = await handleLogin(data);
            console.log("🟢 Login result:", result); // Debug

            if (result.success) {
                console.log("✅ Login successful, navigating to dashboard..."); // Debug

                // Check role and redirect accordingly
                if (result.data?.role === 'admin') {
                    window.location.href = "/admin";
                } else {
                    window.location.href = "/user/dashboard";
                }
            } else {
                console.log("❌ Login failed:", result.message); // Debug
                setError(result.message || "Login failed. Please try again.");
                setIsLoading(false);
            }
        } catch (err: any) {
            console.error("🔴 Login error:", err); // Debug
            setError(err.message || "An unexpected error occurred.");
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Error Alert */}
            {error && (
                <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                            <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <p className="text-sm text-red-600 dark:text-red-400 font-medium">{error}</p>
                    </div>
                </div>
            )}

            {/* Email Input */}
            <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-semibold text-foreground">
                    Email Address
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <input
                        {...register("email")}
                        type="email"
                        id="email"
                        placeholder="you@example.com"
                        className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-background transition-all duration-200 placeholder:text-muted-foreground/60"
                    />
                </div>
                {errors.email && (
                    <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1 mt-1">
                        <span className="text-xs">⚠</span> {errors.email.message}
                    </p>
                )}
            </div>

            {/* Password Input */}
            <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-semibold text-foreground">
                    Password
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <input
                        {...register("password")}
                        type={showPassword ? "text" : "password"}
                        id="password"
                        placeholder="••••••••"
                        className="w-full pl-10 pr-12 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-background transition-all duration-200 placeholder:text-muted-foreground/60"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground transition-colors"
                    >
                        {showPassword ? (
                            <EyeOff className="h-5 w-5" />
                        ) : (
                            <Eye className="h-5 w-5" />
                        )}
                    </button>
                </div>
                {errors.password && (
                    <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1 mt-1">
                        <span className="text-xs">⚠</span> {errors.password.message}
                    </p>
                )}
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-pink-600 text-white rounded-lg font-semibold disabled:opacity-60 disabled:cursor-not-allowed hover:from-orange-600 hover:to-pink-700 hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-md"
            >
                {isLoading ? (
                    <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Logging in...</span>
                    </>
                ) : (
                    <span>Log in</span>
                )}
            </button>

            {/* Sign Up Link */}
            <p className="text-center text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link
                    href="/register"
                    className="font-semibold text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 hover:underline transition-colors"
                >
                    Sign up
                </Link>
            </p>
        </form>
    );
}
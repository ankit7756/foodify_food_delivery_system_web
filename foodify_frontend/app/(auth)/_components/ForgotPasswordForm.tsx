"use client";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { forgetPasswordSchema, ForgetPasswordData } from "../schema";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { handleRequestPasswordReset } from "@/lib/actions/auth-action";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Mail, Loader2, ArrowLeft } from "lucide-react";

export default function ForgotPasswordForm() {
    const router = useRouter();
    const [pending, startTransition] = useTransition();
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ForgetPasswordData>({
        resolver: zodResolver(forgetPasswordSchema),
    });
    const [error, setError] = useState<string | null>(null);

    const onSubmit = (values: ForgetPasswordData) => {
        setError(null);
        startTransition(async () => {
            try {
                const result = await handleRequestPasswordReset(values.email);
                if (result.success) {
                    toast.success("If the email is registered, a reset link has been sent.");
                    router.push('/login');
                } else {
                    throw new Error(result.message || 'Failed to send reset link');
                }
            } catch (err: any) {
                setError(err.message || 'Failed to send reset link');
                toast.error(err.message || 'Failed to send reset link');
            }
        });
    };

    return (
        <div className="space-y-6">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent">
                    Forgot Password?
                </h1>
                <p className="text-sm text-muted-foreground">
                    Enter your email and we'll send you a reset link
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {error && (
                    <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200">
                        <p className="text-sm text-red-600">{error}</p>
                    </div>
                )}

                <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-semibold">
                        Email Address
                    </label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <input
                            {...register("email")}
                            type="email"
                            id="email"
                            placeholder="you@example.com"
                            className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-background"
                        />
                    </div>
                    {errors.email && (
                        <p className="text-sm text-red-600 flex items-center gap-1">
                            <span className="text-xs">⚠</span> {errors.email.message}
                        </p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting || pending}
                    className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-pink-600 text-white rounded-lg font-semibold disabled:opacity-60 hover:from-orange-600 hover:to-pink-700 transition-all flex items-center justify-center gap-2"
                >
                    {isSubmitting || pending ? (
                        <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            <span>Sending...</span>
                        </>
                    ) : (
                        <span>Send Reset Link</span>
                    )}
                </button>

                <div className="text-center space-y-2">
                    <Link
                        href="/login"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-orange-600 hover:text-orange-700 hover:underline"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Login
                    </Link>
                </div>
            </form>
        </div>
    );
}
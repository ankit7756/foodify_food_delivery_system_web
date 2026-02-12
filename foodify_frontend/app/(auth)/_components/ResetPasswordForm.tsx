"use client";
import { useForm } from "react-hook-form";
import { resetPasswordSchema, ResetPasswordData } from "../schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { handleResetPassword } from "@/lib/actions/auth-action";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import Link from "next/link";
import { Lock, Loader2, CheckCircle } from "lucide-react";

export default function ResetPasswordForm({ token }: { token: string }) {
    const router = useRouter();
    const [pending, startTransition] = useTransition();
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ResetPasswordData>({
        resolver: zodResolver(resetPasswordSchema),
    });
    const [error, setError] = useState<string | null>(null);

    const onSubmit = (values: ResetPasswordData) => {
        setError(null);
        startTransition(async () => {
            try {
                const result = await handleResetPassword(token, values.newPassword);
                if (result.success) {
                    toast.success("Password has been reset successfully!");
                    router.push('/login');
                } else {
                    throw new Error(result.message || 'Failed to reset password');
                }
            } catch (err: any) {
                setError(err.message || 'Failed to reset password');
                toast.error(err.message || 'Failed to reset password');
            }
        });
    };

    return (
        <div className="space-y-6">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent">
                    Reset Password
                </h1>
                <p className="text-sm text-muted-foreground">
                    Enter your new password below
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {error && (
                    <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200">
                        <p className="text-sm text-red-600">{error}</p>
                    </div>
                )}

                <div className="space-y-2">
                    <label htmlFor="newPassword" className="block text-sm font-semibold">
                        New Password
                    </label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <input
                            {...register("newPassword")}
                            type="password"
                            id="newPassword"
                            placeholder="••••••••"
                            className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-background"
                        />
                    </div>
                    {errors.newPassword && (
                        <p className="text-sm text-red-600 flex items-center gap-1">
                            <span className="text-xs">⚠</span> {errors.newPassword.message}
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <label htmlFor="confirmNewPassword" className="block text-sm font-semibold">
                        Confirm New Password
                    </label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <input
                            {...register("confirmNewPassword")}
                            type="password"
                            id="confirmNewPassword"
                            placeholder="••••••••"
                            className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-background"
                        />
                    </div>
                    {errors.confirmNewPassword && (
                        <p className="text-sm text-red-600 flex items-center gap-1">
                            <span className="text-xs">⚠</span> {errors.confirmNewPassword.message}
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
                            <span>Resetting...</span>
                        </>
                    ) : (
                        <>
                            <CheckCircle className="h-5 w-5" />
                            <span>Reset Password</span>
                        </>
                    )}
                </button>

                <div className="text-center">
                    <Link
                        href="/login"
                        className="text-sm font-semibold text-orange-600 hover:text-orange-700 hover:underline"
                    >
                        Remember your password? Log in
                    </Link>
                </div>
            </form>
        </div>
    );
}
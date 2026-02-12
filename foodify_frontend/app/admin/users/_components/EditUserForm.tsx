"use client";
import { Controller, useForm } from "react-hook-form";
import { UserEditData, UserEditSchema } from "@/app/admin/users/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState, useTransition } from "react";
import { toast } from "react-toastify";
import { handleUpdateUser } from "@/lib/actions/admin/user-action";
import { useRouter } from "next/navigation";
import { Loader2, User, Mail, Phone } from "lucide-react";

export default function EditUserForm({ user }: { user: any }) {
    const router = useRouter();
    const [pending, startTransition] = useTransition();
    const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm<UserEditData>({
        resolver: zodResolver(UserEditSchema),
        defaultValues: {
            fullName: user?.fullName || '',
            username: user?.username || '',
            phone: user?.phone || '',
            email: user?.email || '',
        }
    });

    const [error, setError] = useState<string | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (file: File | undefined, onChange: (file: File | undefined) => void) => {
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setPreviewImage(null);
        }
        onChange(file);
    };

    const handleDismissImage = (onChange?: (file: File | undefined) => void) => {
        setPreviewImage(null);
        onChange?.(undefined);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const onSubmit = async (data: UserEditData) => {
        setError(null);
        startTransition(async () => {
            try {
                const formData = new FormData();

                // Only append fields that are provided
                if (data.fullName) formData.append('fullName', data.fullName);
                if (data.username) formData.append('username', data.username);
                if (data.phone) formData.append('phone', data.phone);
                if (data.email) formData.append('email', data.email);
                if (data.password) formData.append('password', data.password);
                if (data.confirmPassword) formData.append('confirmPassword', data.confirmPassword);

                if (data.profileImage) {
                    formData.append('profileImage', data.profileImage);
                }

                const response = await handleUpdateUser(user._id || user.id, formData);

                if (!response.success) {
                    throw new Error(response.message || 'Update user failed');
                }

                toast.success('User updated successfully');
                setTimeout(() => {
                    router.push('/admin/users');
                }, 1000);

            } catch (error: Error | any) {
                toast.error(error.message || 'Update user failed');
                setError(error.message || 'Update user failed');
            }
        });
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Edit User</h1>
                <button
                    onClick={() => router.back()}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                    Back
                </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-lg border">
                {error && (
                    <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200">
                        <p className="text-sm text-red-600">{error}</p>
                    </div>
                )}

                {/* Profile Image Display */}
                <div className="flex items-center gap-6">
                    {previewImage ? (
                        <div className="relative">
                            <img
                                src={previewImage}
                                alt="Preview"
                                className="w-24 h-24 rounded-full object-cover"
                            />
                            <Controller
                                name="profileImage"
                                control={control}
                                render={({ field: { onChange } }) => (
                                    <button
                                        type="button"
                                        onClick={() => handleDismissImage(onChange)}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                                    >
                                        ✕
                                    </button>
                                )}
                            />
                        </div>
                    ) : user?.profileImage ? (
                        <img
                            src={user.profileImage}
                            alt="Current Profile"
                            className="w-24 h-24 rounded-full object-cover"
                        />
                    ) : (
                        <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                            <User className="w-12 h-12 text-gray-400" />
                        </div>
                    )}

                    {/* Profile Image Input */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Update Profile Image</label>
                        <Controller
                            name="profileImage"
                            control={control}
                            render={({ field: { onChange } }) => (
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    onChange={(e) => handleImageChange(e.target.files?.[0], onChange)}
                                    accept=".jpg,.jpeg,.png,.webp"
                                    className="text-sm"
                                />
                            )}
                        />
                        {errors.profileImage && (
                            <p className="text-xs text-red-600 mt-1">{errors.profileImage.message}</p>
                        )}
                    </div>
                </div>

                {/* Full Name */}
                <div>
                    <label className="block text-sm font-semibold mb-2" htmlFor="fullName">
                        Full Name
                    </label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            id="fullName"
                            type="text"
                            {...register("fullName")}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="John Doe"
                        />
                    </div>
                    {errors.fullName && (
                        <p className="text-xs text-red-600 mt-1">{errors.fullName.message}</p>
                    )}
                </div>

                {/* Username */}
                <div>
                    <label className="block text-sm font-semibold mb-2" htmlFor="username">
                        Username
                    </label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            id="username"
                            type="text"
                            {...register("username")}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="johndoe"
                        />
                    </div>
                    {errors.username && (
                        <p className="text-xs text-red-600 mt-1">{errors.username.message}</p>
                    )}
                </div>

                {/* Email */}
                <div>
                    <label className="block text-sm font-semibold mb-2" htmlFor="email">
                        Email
                    </label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            id="email"
                            type="email"
                            {...register("email")}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="john@example.com"
                        />
                    </div>
                    {errors.email && (
                        <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>
                    )}
                </div>

                {/* Phone */}
                <div>
                    <label className="block text-sm font-semibold mb-2" htmlFor="phone">
                        Phone
                    </label>
                    <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            id="phone"
                            type="tel"
                            {...register("phone")}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="1234567890"
                        />
                    </div>
                    {errors.phone && (
                        <p className="text-xs text-red-600 mt-1">{errors.phone.message}</p>
                    )}
                </div>

                {/* Password (Optional) */}
                <div>
                    <label className="block text-sm font-semibold mb-2" htmlFor="password">
                        New Password (leave blank to keep current)
                    </label>
                    <input
                        id="password"
                        type="password"
                        {...register("password")}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="••••••"
                    />
                    {errors.password && (
                        <p className="text-xs text-red-600 mt-1">{errors.password.message}</p>
                    )}
                </div>

                {/* Confirm Password */}
                <div>
                    <label className="block text-sm font-semibold mb-2" htmlFor="confirmPassword">
                        Confirm New Password
                    </label>
                    <input
                        id="confirmPassword"
                        type="password"
                        {...register("confirmPassword")}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="••••••"
                    />
                    {errors.confirmPassword && (
                        <p className="text-xs text-red-600 mt-1">{errors.confirmPassword.message}</p>
                    )}
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isSubmitting || pending}
                    className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {isSubmitting || pending ? (
                        <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            <span>Updating...</span>
                        </>
                    ) : (
                        <span>Update User</span>
                    )}
                </button>
            </form>
        </div>
    );
}
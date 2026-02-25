"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import UserForm from "@/app/admin/_components/UserForm";
import { createUser } from "@/lib/api/admin/user";

export default function AddUserPage() {
    const router = useRouter();

    const handleSubmit = useCallback(async (fd: FormData) => {
        try {
            const res = await createUser(fd);
            if (res.success) {
                setTimeout(() => router.push("/admin/dashboard"), 1200);
                return { success: true };
            }
            return { success: false, message: res.message };
        } catch (err: any) {
            return { success: false, message: err.message };
        }
    }, [router]);

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-3">
                <button onClick={() => router.back()} className="p-2 rounded-xl hover:bg-accent transition-colors">
                    <ChevronLeft className="h-5 w-5" />
                </button>
                <div>
                    <h1 className="text-xl font-extrabold">Add New User</h1>
                    <p className="text-sm text-muted-foreground">Create a new user account</p>
                </div>
            </div>
            <UserForm mode="add" onSubmit={handleSubmit} />
        </div>
    );
}
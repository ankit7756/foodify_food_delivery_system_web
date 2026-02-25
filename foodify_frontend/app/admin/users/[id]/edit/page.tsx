"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Loader2 } from "lucide-react";
import UserForm from "@/app/admin/_components/UserForm";
import { getUserById, updateUser } from "@/lib/api/admin/user";

export default function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [id, setId] = useState("");

    useEffect(() => {
        params.then(({ id }) => {
            setId(id);
            getUserById(id)
                .then((res) => setUser(res.data))
                .finally(() => setLoading(false));
        });
    }, [params]);

    const handleSubmit = useCallback(async (fd: FormData) => {
        try {
            const res = await updateUser(id, fd);
            if (res.success) {
                setTimeout(() => router.push(`/admin/users/${id}`), 1200);
                return { success: true };
            }
            return { success: false, message: res.message };
        } catch (err: any) {
            return { success: false, message: err.message };
        }
    }, [id, router]);

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
        </div>
    );

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-3">
                <button onClick={() => router.back()} className="p-2 rounded-xl hover:bg-accent transition-colors">
                    <ChevronLeft className="h-5 w-5" />
                </button>
                <div>
                    <h1 className="text-xl font-extrabold">Edit User</h1>
                    <p className="text-sm text-muted-foreground">Update {user?.fullName}'s information</p>
                </div>
            </div>
            {user && <UserForm mode="edit" initialData={user} onSubmit={handleSubmit} />}
        </div>
    );
}
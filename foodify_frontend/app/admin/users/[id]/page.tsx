"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
    ChevronLeft, User, Mail, Phone, AtSign, Shield, Calendar,
    Pencil, Trash2, Loader2
} from "lucide-react";
import { getUserById, deleteUser } from "@/lib/api/admin/user";
import DeleteModal from "@/app/_components/DeleteModal";

function InfoRow({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
    return (
        <div className="flex items-center gap-4 py-3.5 border-b border-border/50 last:border-0">
            <div className="h-9 w-9 rounded-xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center flex-shrink-0">
                <Icon className="h-4 w-4 text-orange-500" />
            </div>
            <div>
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="text-sm font-medium">{value || "—"}</p>
            </div>
        </div>
    );
}

export default function ViewUserPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [id, setId] = useState("");
    const [showDelete, setShowDelete] = useState(false);

    useEffect(() => {
        params.then(({ id }) => {
            setId(id);
            getUserById(id)
                .then((res) => setUser(res.data))
                .finally(() => setLoading(false));
        });
    }, [params]);

    const handleDelete = async () => {
        await deleteUser(id);
        router.push("/admin/dashboard");
    };

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
        </div>
    );

    if (!user) return <div className="text-center py-20 text-muted-foreground">User not found.</div>;

    const joinedDate = user.createdAt
        ? new Date(user.createdAt).toLocaleDateString("en-NP", { year: "numeric", month: "long", day: "numeric" })
        : "—";

    return (
        <div className="max-w-2xl mx-auto space-y-4">
            <div className="flex items-center gap-3">
                <button onClick={() => router.back()}
                    className="p-2 rounded-xl hover:bg-accent transition-colors">
                    <ChevronLeft className="h-5 w-5" />
                </button>
                <h1 className="text-xl font-extrabold">View User</h1>
            </div>

            {/* Profile card */}
            <div className="bg-background border border-border rounded-2xl overflow-hidden shadow-sm">
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 pt-8 pb-14 px-6 flex flex-col items-center text-center relative">
                    <div className="h-20 w-20 rounded-full overflow-hidden ring-4 ring-white/20 shadow-lg">
                        {user.profileImage ? (
                            <Image src={user.profileImage} alt={user.fullName} width={80} height={80} unoptimized className="object-cover w-full h-full" />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-white text-2xl font-bold">
                                {user.fullName?.[0]?.toUpperCase() ?? "U"}
                            </div>
                        )}
                    </div>
                    <h2 className="text-xl font-bold text-white mt-3">{user.fullName}</h2>
                    <p className="text-white/60 text-sm">@{user.username}</p>
                    <span className={`mt-2 text-xs font-bold px-3 py-1 rounded-full ${user.role === "admin"
                            ? "bg-purple-500/30 text-purple-300"
                            : "bg-blue-500/30 text-blue-300"
                        }`}>
                        {user.role}
                    </span>
                </div>

                <div className="-mt-8 mx-4 mb-4 bg-background border border-border rounded-2xl px-5 py-1 shadow-sm">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground pt-4 pb-2">Details</h3>
                    <InfoRow icon={User} label="Full Name" value={user.fullName} />
                    <InfoRow icon={AtSign} label="Username" value={`@${user.username}`} />
                    <InfoRow icon={Mail} label="Email" value={user.email} />
                    <InfoRow icon={Phone} label="Phone" value={user.phone} />
                    <InfoRow icon={Shield} label="Role" value={user.role} />
                    <InfoRow icon={Calendar} label="Joined" value={joinedDate} />
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
                <Link href={`/admin/users/${id}/edit`}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-pink-600 text-white font-bold text-sm hover:from-orange-600 hover:to-pink-700 transition-all">
                    <Pencil className="h-4 w-4" />
                    Edit User
                </Link>
                <button
                    onClick={() => setShowDelete(true)}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl border border-red-300 dark:border-red-800 text-red-500 font-bold text-sm hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                    <Trash2 className="h-4 w-4" />
                    Delete
                </button>
            </div>

            <DeleteModal
                isOpen={showDelete}
                onClose={() => setShowDelete(false)}
                onConfirm={handleDelete}
                title="Delete User"
                description={`Are you sure you want to delete "${user.fullName}"? This cannot be undone.`}
            />
        </div>
    );
}
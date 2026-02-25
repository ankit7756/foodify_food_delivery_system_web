"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
    Users, UtensilsCrossed, ShoppingBag, ClipboardList,
    TrendingUp, Eye, Pencil, Trash2, Search, ChevronLeft, ChevronRight, Loader2
} from "lucide-react";
import { getAdminStats } from "@/lib/api/admin-api";
import { getAllUsers, deleteUser } from "@/lib/api/admin/user";
import DeleteModal from "@/app/_components/DeleteModal";
import Image from "next/image";

const STATUS_COLORS: Record<string, string> = {
    pending: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    preparing: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    out_for_delivery: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    delivered: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const STATUS_LABELS: Record<string, string> = {
    pending: "Pending", preparing: "Preparing",
    out_for_delivery: "Out for Delivery", delivered: "Delivered", cancelled: "Cancelled",
};

function StatCard({ label, value, icon: Icon, color, sub }: {
    label: string; value: string | number; icon: any; color: string; sub?: string;
}) {
    return (
        <div className="bg-background border border-border rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-muted-foreground font-medium">{label}</p>
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${color}`}>
                    <Icon className="h-5 w-5" />
                </div>
            </div>
            <p className="text-3xl font-extrabold">{value}</p>
            {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
        </div>
    );
}

function UserAvatar({ src, name }: { src?: string | null; name?: string }) {
    const initial = name?.[0]?.toUpperCase() ?? "U";
    if (src) return (
        <Image src={src} alt={name ?? ""} width={32} height={32} unoptimized
            className="h-8 w-8 rounded-full object-cover flex-shrink-0" />
    );
    return (
        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {initial}
        </div>
    );
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [users, setUsers] = useState<any[]>([]);
    const [pagination, setPagination] = useState({ page: 1, totalPages: 1, totalItems: 0 });
    const [search, setSearch] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [loadingStats, setLoadingStats] = useState(true);
    const [loadingUsers, setLoadingUsers] = useState(true);
    const [deleteTarget, setDeleteTarget] = useState<any>(null);

    useEffect(() => {
        getAdminStats()
            .then(setStats)
            .finally(() => setLoadingStats(false));
    }, []);

    const fetchUsers = async (page = 1) => {
        setLoadingUsers(true);
        try {
            const res = await getAllUsers(String(page), "8", search || undefined);
            setUsers(res.data ?? []);
            setPagination(res.pagination ?? { page: 1, totalPages: 1, totalItems: 0 });
        } finally {
            setLoadingUsers(false);
        }
    };

    useEffect(() => { fetchUsers(1); }, [search]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setSearch(searchInput);
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        await deleteUser(deleteTarget._id);
        setDeleteTarget(null);
        fetchUsers(pagination.page);
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-extrabold">Dashboard</h1>
                <p className="text-muted-foreground text-sm mt-0.5">Welcome back! Here's what's happening.</p>
            </div>

            {/* Stats */}
            {loadingStats ? (
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="h-28 rounded-2xl bg-muted animate-pulse" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                    <StatCard label="Total Users" value={stats?.totalUsers ?? 0} icon={Users}
                        color="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" />
                    <StatCard label="Restaurants" value={stats?.totalRestaurants ?? 0} icon={UtensilsCrossed}
                        color="bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400" />
                    <StatCard label="Total Foods" value={stats?.totalFoods ?? 0} icon={ShoppingBag}
                        color="bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400" />
                    <StatCard label="Total Orders" value={stats?.totalOrders ?? 0} icon={ClipboardList}
                        color="bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400" />
                    <StatCard label="Orders This Month" value={stats?.ordersThisMonth ?? 0} icon={TrendingUp}
                        color="bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" />
                    <StatCard label="Revenue This Month" value={`Rs. ${(stats?.revenueThisMonth ?? 0).toLocaleString()}`}
                        icon={TrendingUp} color="bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
                        sub="Delivered orders only" />
                </div>
            )}

            {/* Recent Orders */}
            {stats?.recentOrders?.length > 0 && (
                <div className="bg-background border border-border rounded-2xl shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                        <h2 className="font-bold text-sm">Recent Orders</h2>
                        <Link href="/admin/orders" className="text-xs text-orange-500 hover:underline font-medium">View all</Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border bg-muted/30">
                                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Customer</th>
                                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Restaurant</th>
                                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Amount</th>
                                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Status</th>
                                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/50">
                                {stats.recentOrders.map((order: any) => (
                                    <tr key={order._id} className="hover:bg-accent/30 transition-colors">
                                        <td className="px-5 py-3">
                                            <p className="font-medium truncate max-w-[140px]">
                                                {order.userId?.fullName ?? "Unknown"}
                                            </p>
                                            <p className="text-xs text-muted-foreground">{order.userId?.email ?? ""}</p>
                                        </td>
                                        <td className="px-5 py-3 text-muted-foreground">{order.restaurantName}</td>
                                        <td className="px-5 py-3 font-semibold">Rs. {order.totalAmount}</td>
                                        <td className="px-5 py-3">
                                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_COLORS[order.status] ?? ""}`}>
                                                {STATUS_LABELS[order.status] ?? order.status}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3 text-muted-foreground text-xs">
                                            {new Date(order.createdAt).toLocaleDateString("en-NP", { day: "numeric", month: "short" })}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Users table */}
            <div className="bg-background border border-border rounded-2xl shadow-sm overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-border">
                    <h2 className="font-bold text-sm">All Users</h2>
                    <div className="flex items-center gap-2">
                        <form onSubmit={handleSearch} className="flex items-center gap-2 bg-muted/50 rounded-xl px-3 py-2">
                            <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <input
                                type="text"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                placeholder="Search users..."
                                className="bg-transparent text-sm outline-none w-44 placeholder:text-muted-foreground"
                            />
                        </form>
                        <Link href="/admin/users/add"
                            className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-pink-600 text-white text-xs font-bold hover:from-orange-600 hover:to-pink-700 transition-all whitespace-nowrap">
                            + Add User
                        </Link>
                    </div>
                </div>

                {loadingUsers ? (
                    <div className="p-8 flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-orange-500" /></div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-border bg-muted/30">
                                        <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">User</th>
                                        <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Email</th>
                                        <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Phone</th>
                                        <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Role</th>
                                        <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/50">
                                    {users.map((user) => (
                                        <tr key={user._id} className="hover:bg-accent/30 transition-colors">
                                            <td className="px-5 py-3">
                                                <div className="flex items-center gap-2.5">
                                                    <UserAvatar src={user.profileImage} name={user.fullName} />
                                                    <p className="font-medium">{user.fullName}</p>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3 text-muted-foreground">{user.email}</td>
                                            <td className="px-5 py-3 text-muted-foreground">{user.phone}</td>
                                            <td className="px-5 py-3">
                                                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${user.role === "admin"
                                                        ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                                                        : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                                                    }`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3">
                                                <div className="flex items-center gap-1.5">
                                                    <Link href={`/admin/users/${user._id}`}
                                                        className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-500 transition-colors">
                                                        <Eye className="h-4 w-4" />
                                                    </Link>
                                                    <Link href={`/admin/users/${user._id}/edit`}
                                                        className="p-1.5 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/20 text-orange-500 transition-colors">
                                                        <Pencil className="h-4 w-4" />
                                                    </Link>
                                                    <button onClick={() => setDeleteTarget(user)}
                                                        className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors">
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {pagination.totalPages > 1 && (
                            <div className="flex items-center justify-between px-5 py-3 border-t border-border">
                                <p className="text-xs text-muted-foreground">
                                    {pagination.totalItems} users total
                                </p>
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => fetchUsers(pagination.page - 1)}
                                        disabled={pagination.page === 1}
                                        className="p-1.5 rounded-lg hover:bg-accent disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </button>
                                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                                        <button
                                            key={p}
                                            onClick={() => fetchUsers(p)}
                                            className={`h-7 w-7 rounded-lg text-xs font-semibold transition-colors ${p === pagination.page
                                                    ? "bg-orange-500 text-white"
                                                    : "hover:bg-accent text-foreground"
                                                }`}
                                        >
                                            {p}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => fetchUsers(pagination.page + 1)}
                                        disabled={pagination.page === pagination.totalPages}
                                        className="p-1.5 rounded-lg hover:bg-accent disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            <DeleteModal
                isOpen={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleDelete}
                title="Delete User"
                description={`Are you sure you want to delete "${deleteTarget?.fullName}"? This action cannot be undone.`}
            />
        </div>
    );
}
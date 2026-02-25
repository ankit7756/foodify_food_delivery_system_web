"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Search, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { adminGetOrders, adminUpdateOrderStatus } from "@/lib/api/admin-api";

const STATUSES = ["all", "pending", "preparing", "out_for_delivery", "delivered", "cancelled"];

const STATUS_COLORS: Record<string, string> = {
    pending: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    preparing: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    out_for_delivery: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    delivered: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const STATUS_LABELS: Record<string, string> = {
    all: "All", pending: "Pending", preparing: "Preparing",
    out_for_delivery: "Out for Delivery", delivered: "Delivered", cancelled: "Cancelled",
};

function StatusBadge({ status, orderId, onUpdate }: { status: string; orderId: string; onUpdate: () => void }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = async (newStatus: string) => {
        if (newStatus === status) { setOpen(false); return; }
        setLoading(true);
        try {
            await adminUpdateOrderStatus(orderId, newStatus);
            onUpdate();
        } finally {
            setLoading(false);
            setOpen(false);
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => setOpen(!open)}
                className={`text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 transition-all hover:opacity-80 ${STATUS_COLORS[status]}`}
            >
                {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : STATUS_LABELS[status] ?? status}
                <span className="text-[10px] opacity-60">▾</span>
            </button>
            {open && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
                    <div className="absolute left-0 top-full mt-1 w-40 bg-background border border-border rounded-xl shadow-xl z-20 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
                        {STATUSES.filter(s => s !== "all").map((s) => (
                            <button key={s} onClick={() => handleChange(s)}
                                className={`w-full text-left px-3 py-2 text-xs font-medium hover:bg-accent transition-colors flex items-center gap-2 ${s === status ? "font-bold" : ""}`}>
                                <span className={`h-2 w-2 rounded-full flex-shrink-0 ${s === "delivered" ? "bg-green-500" :
                                        s === "cancelled" ? "bg-red-500" :
                                            s === "preparing" ? "bg-blue-500" :
                                                s === "out_for_delivery" ? "bg-purple-500" : "bg-orange-500"
                                    }`} />
                                {STATUS_LABELS[s]}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

export default function OrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [pagination, setPagination] = useState({ page: 1, totalPages: 1, totalItems: 0 });
    const [statusFilter, setStatusFilter] = useState("all");
    const [search, setSearch] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [loading, setLoading] = useState(true);

    const fetchOrders = async (page = 1) => {
        setLoading(true);
        try {
            const res = await adminGetOrders(
                String(page), "15",
                statusFilter !== "all" ? statusFilter : undefined,
                search || undefined
            );
            setOrders(res.data ?? []);
            setPagination(res.pagination ?? { page: 1, totalPages: 1, totalItems: 0 });
        } finally { setLoading(false); }
    };

    useEffect(() => { fetchOrders(1); }, [statusFilter, search]);

    return (
        <div className="space-y-5">
            <div>
                <h1 className="text-2xl font-extrabold">Orders</h1>
                <p className="text-sm text-muted-foreground">Manage and update all customer orders</p>
            </div>

            {/* Status filter tabs */}
            <div className="flex items-center gap-1 flex-wrap">
                {STATUSES.map((s) => (
                    <button key={s} onClick={() => setStatusFilter(s)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${statusFilter === s
                                ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-sm"
                                : "text-muted-foreground hover:text-foreground hover:bg-accent"
                            }`}>
                        {STATUS_LABELS[s]}
                    </button>
                ))}
            </div>

            {/* Search */}
            <form onSubmit={(e) => { e.preventDefault(); setSearch(searchInput); }}
                className="flex items-center gap-2 bg-background border border-border rounded-xl px-4 py-2.5 w-full max-w-sm shadow-sm">
                <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <input type="text" value={searchInput} onChange={e => setSearchInput(e.target.value)}
                    placeholder="Search by restaurant..." className="flex-1 text-sm bg-transparent outline-none placeholder:text-muted-foreground" />
            </form>

            {loading ? (
                <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-orange-500" /></div>
            ) : (
                <div className="bg-background border border-border rounded-2xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border bg-muted/30">
                                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Order ID</th>
                                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Customer</th>
                                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Restaurant</th>
                                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Items</th>
                                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Total</th>
                                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Payment</th>
                                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Status</th>
                                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/50">
                                {orders.length === 0 ? (
                                    <tr><td colSpan={8} className="text-center py-12 text-muted-foreground">No orders found</td></tr>
                                ) : orders.map((order) => (
                                    <tr key={order._id} className="hover:bg-accent/30 transition-colors">
                                        <td className="px-5 py-3">
                                            <span className="font-mono text-xs text-muted-foreground">
                                                #{order._id.slice(-8).toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3">
                                            <div className="flex items-center gap-2">
                                                <div className="h-7 w-7 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0 overflow-hidden">
                                                    {order.userId?.profileImage ? (
                                                        <Image src={order.userId.profileImage} alt="" width={28} height={28} unoptimized className="object-cover w-full h-full" />
                                                    ) : (
                                                        order.userId?.fullName?.[0]?.toUpperCase() ?? "U"
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-xs">{order.userId?.fullName ?? "Unknown"}</p>
                                                    <p className="text-[10px] text-muted-foreground">{order.userId?.email ?? ""}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3 text-muted-foreground text-xs">{order.restaurantName}</td>
                                        <td className="px-5 py-3 text-muted-foreground">{order.items?.length ?? 0} items</td>
                                        <td className="px-5 py-3 font-bold">Rs. {order.totalAmount}</td>
                                        <td className="px-5 py-3 text-xs text-muted-foreground">{order.paymentMethod}</td>
                                        <td className="px-5 py-3">
                                            <StatusBadge status={order.status} orderId={order._id} onUpdate={() => fetchOrders(pagination.page)} />
                                        </td>
                                        <td className="px-5 py-3 text-xs text-muted-foreground">
                                            {new Date(order.createdAt).toLocaleDateString("en-NP", { day: "numeric", month: "short", year: "numeric" })}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {pagination.totalPages > 1 && (
                        <div className="flex items-center justify-between px-5 py-3 border-t border-border">
                            <p className="text-xs text-muted-foreground">{pagination.totalItems} orders total</p>
                            <div className="flex items-center gap-1">
                                <button onClick={() => fetchOrders(pagination.page - 1)} disabled={pagination.page === 1}
                                    className="p-1.5 rounded-lg hover:bg-accent disabled:opacity-40"><ChevronLeft className="h-4 w-4" /></button>
                                {Array.from({ length: Math.min(pagination.totalPages, 7) }, (_, i) => i + 1).map((p) => (
                                    <button key={p} onClick={() => fetchOrders(p)}
                                        className={`h-7 w-7 rounded-lg text-xs font-semibold ${p === pagination.page ? "bg-orange-500 text-white" : "hover:bg-accent"}`}>{p}</button>
                                ))}
                                <button onClick={() => fetchOrders(pagination.page + 1)} disabled={pagination.page === pagination.totalPages}
                                    className="p-1.5 rounded-lg hover:bg-accent disabled:opacity-40"><ChevronRight className="h-4 w-4" /></button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
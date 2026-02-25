"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard, Users, UtensilsCrossed, ShoppingBag,
    ClipboardList, Star, LogOut, ChevronRight, X
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const NAV = [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/admin/restaurants", label: "Restaurants", icon: UtensilsCrossed },
    { href: "/admin/foods", label: "Foods", icon: ShoppingBag },
    { href: "/admin/orders", label: "Orders", icon: ClipboardList },
    { href: "/admin/reviews", label: "Reviews", icon: Star },
];

interface SidebarProps {
    mobileOpen?: boolean;
    onClose?: () => void;
}

export default function AdminSidebar({ mobileOpen, onClose }: SidebarProps) {
    const pathname = usePathname();
    const { logout } = useAuth();

    const isActive = (href: string) =>
        pathname === href || (href !== "/admin/dashboard" && pathname.startsWith(href));

    const content = (
        <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="flex items-center justify-between px-5 py-5 border-b border-white/10">
                <div>
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-white/20 flex items-center justify-center text-white font-bold text-sm">
                            F
                        </div>
                        <span className="font-extrabold text-white text-lg">Foodify</span>
                    </div>
                    <p className="text-white/50 text-xs mt-0.5 ml-10">Admin Panel</p>
                </div>
                {onClose && (
                    <button onClick={onClose} className="text-white/60 hover:text-white lg:hidden">
                        <X className="h-5 w-5" />
                    </button>
                )}
            </div>

            {/* Nav */}
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                {NAV.map(({ href, label, icon: Icon }) => (
                    <Link
                        key={href}
                        href={href}
                        onClick={onClose}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${isActive(href)
                            ? "bg-white/20 text-white shadow-sm"
                            : "text-white/60 hover:text-white hover:bg-white/10"
                            }`}
                    >
                        <Icon className="h-4.5 w-4.5 flex-shrink-0" />
                        <span className="flex-1">{label}</span>
                        {isActive(href) && <ChevronRight className="h-3.5 w-3.5 opacity-60" />}
                    </Link>
                ))}
            </nav>
        </div>
    );

    return (
        <>
            {/* Desktop sidebar */}
            <aside className="hidden lg:flex flex-col w-60 bg-gradient-to-b from-gray-900 to-gray-800 fixed inset-y-0 left-0 z-40">
                {content}
            </aside>

            {/* Mobile overlay */}
            {mobileOpen && (
                <>
                    <div
                        className="fixed inset-0 bg-black/60 z-40 lg:hidden"
                        onClick={onClose}
                    />
                    <aside className="fixed inset-y-0 left-0 w-64 bg-gradient-to-b from-gray-900 to-gray-800 z-50 lg:hidden flex flex-col">
                        {content}
                    </aside>
                </>
            )}
        </>
    );
}
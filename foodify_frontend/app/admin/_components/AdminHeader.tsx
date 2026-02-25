"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, LogOut, Bell, ChevronDown, User, Settings } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

const PAGE_TITLES: Record<string, { title: string; desc: string }> = {
    "/admin/dashboard": { title: "Dashboard", desc: "Overview of your platform" },
    "/admin/users": { title: "Users", desc: "Manage all user accounts" },
    "/admin/users/add": { title: "Add User", desc: "Create a new user account" },
    "/admin/restaurants": { title: "Restaurants", desc: "Manage all restaurants" },
    "/admin/foods": { title: "Foods", desc: "Manage all food items" },
    "/admin/orders": { title: "Orders", desc: "View and update order statuses" },
    "/admin/reviews": { title: "Reviews", desc: "All customer reviews" },
};

function getPageMeta(pathname: string) {
    if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
    if (pathname.includes("/users/") && pathname.includes("/edit")) return { title: "Edit User", desc: "Update user information" };
    if (pathname.includes("/users/")) return { title: "View User", desc: "User profile details" };
    return { title: "Admin Panel", desc: "Foodify management" };
}

interface AdminHeaderProps {
    onMenuClick: () => void;
}

export default function AdminHeader({ onMenuClick }: AdminHeaderProps) {
    const pathname = usePathname();
    const { user, logout } = useAuth();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const meta = getPageMeta(pathname);

    return (
        <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-xl border-b border-border shadow-sm">
            <div className="flex items-center justify-between px-4 sm:px-6 h-16 gap-4">

                {/* Left: hamburger + page title */}
                <div className="flex items-center gap-4 min-w-0">
                    <button
                        onClick={onMenuClick}
                        className="lg:hidden p-2 rounded-xl hover:bg-accent transition-colors flex-shrink-0"
                    >
                        <Menu className="h-5 w-5" />
                    </button>

                    <div className="min-w-0">
                        <h1 className="text-lg font-extrabold truncate">{meta.title}</h1>
                        <p className="text-xs text-muted-foreground hidden sm:block">{meta.desc}</p>
                    </div>
                </div>

                {/* Right: actions */}
                <div className="flex items-center gap-2 flex-shrink-0">

                    {/* Bell — decorative, links to nothing in admin */}
                    <button className="relative p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-accent transition-all">
                        <Bell className="h-5 w-5" />
                    </button>

                    {/* Admin profile dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="flex items-center gap-2.5 pl-2 pr-1 py-1.5 rounded-xl hover:bg-accent transition-all"
                        >
                            {/* Avatar */}
                            <div className="h-8 w-8 rounded-full overflow-hidden bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0 ring-2 ring-orange-200 dark:ring-orange-800/50">
                                {user?.profileImage ? (
                                    <Image
                                        src={user.profileImage}
                                        alt="Admin"
                                        width={32}
                                        height={32}
                                        unoptimized
                                        className="object-cover w-full h-full"
                                    />
                                ) : (
                                    user?.fullName?.[0]?.toUpperCase() ?? "A"
                                )}
                            </div>

                            <div className="hidden sm:block text-left">
                                <p className="text-sm font-semibold leading-tight truncate max-w-[120px]">
                                    {user?.fullName ?? "Admin"}
                                </p>
                                <p className="text-[10px] text-orange-500 font-bold uppercase tracking-wide">
                                    {user?.role ?? "admin"}
                                </p>
                            </div>

                            <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 hidden sm:block ${dropdownOpen ? "rotate-180" : ""}`} />
                        </button>

                        {dropdownOpen && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                                <div className="absolute right-0 top-12 w-52 bg-background border border-border rounded-xl shadow-xl py-1.5 z-20 animate-in fade-in slide-in-from-top-2 duration-200">

                                    {/* User info */}
                                    <div className="px-3 py-2.5 border-b border-border/50 mb-1">
                                        <p className="text-sm font-bold truncate">{user?.fullName ?? "Admin"}</p>
                                        <p className="text-xs text-muted-foreground truncate">{user?.email ?? ""}</p>
                                        <span className="inline-block mt-1 text-[10px] font-bold text-orange-500 bg-orange-50 dark:bg-orange-900/20 px-2 py-0.5 rounded-full uppercase tracking-wide">
                                            {user?.role}
                                        </span>
                                    </div>

                                    <Link
                                        href="/admin/dashboard"
                                        onClick={() => setDropdownOpen(false)}
                                        className="flex items-center gap-2.5 px-3 py-2 text-sm text-foreground/70 hover:text-foreground hover:bg-accent transition-all"
                                    >
                                        <User className="h-4 w-4" />
                                        Dashboard
                                    </Link>

                                    <div className="h-px bg-border/50 my-1" />

                                    <button
                                        onClick={() => { setDropdownOpen(false); logout(); }}
                                        className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        Log out
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
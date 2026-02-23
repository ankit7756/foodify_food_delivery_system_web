"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import {
    Home, UtensilsCrossed, ShoppingCart, ClipboardList,
    Search, Bell, User, ChevronDown, LogOut, Settings, X
} from "lucide-react";
import { handleLogout } from "@/lib/actions/auth-action";
import ThemeToggle from "@/app/_components/ThemeToggle";

const NAV_LINKS = [
    { href: "/user/dashboard", label: "Home", icon: Home },
    { href: "/user/restaurants", label: "Restaurants", icon: UtensilsCrossed },
    { href: "/user/orders", label: "Orders", icon: ClipboardList },
    { href: "/user/cart", label: "Cart", icon: ShoppingCart },
];

export default function UserHeader() {
    const pathname = usePathname();
    const router = useRouter();
    const [profileOpen, setProfileOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [cartCount] = useState(0);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLDivElement>(null);

    const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setProfileOpen(false);
            }
            if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
                setSearchOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    const onLogout = async () => {
        await handleLogout();
        router.push("/login");
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/user/restaurants?search=${encodeURIComponent(searchQuery.trim())}`);
            setSearchOpen(false);
            setSearchQuery("");
        }
    };

    return (
        <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-xl border-b border-border/60 shadow-sm">
            <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between gap-6">

                    {/* Logo */}
                    <Link href="/user/dashboard" className="flex items-center gap-2 flex-shrink-0">
                        <div className="relative h-8 w-8 rounded-lg overflow-hidden">
                            <Image src="/images/foodify_logo.png" alt="Foodify" fill className="object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center text-white font-bold text-sm">
                                F
                            </div>
                        </div>
                        <span className="font-bold text-lg bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent hidden sm:block">
                            Foodify
                        </span>
                    </Link>

                    {/* Nav Links */}
                    <div className="hidden md:flex items-center gap-1">
                        {NAV_LINKS.map(({ href, label, icon: Icon }) => (
                            <Link
                                key={href}
                                href={href}
                                className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive(href)
                                        ? "text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20"
                                        : "text-foreground/60 hover:text-foreground hover:bg-accent"
                                    }`}
                            >
                                <Icon className="h-4 w-4" />
                                <span>{label}</span>
                                {label === "Cart" && cartCount > 0 && (
                                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-orange-500 text-white text-[10px] font-bold flex items-center justify-center">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>
                        ))}
                    </div>

                    {/* Right icons */}
                    <div className="flex items-center gap-1.5">

                        {/* Theme Toggle */}
                        <ThemeToggle />

                        {/* Search */}
                        <div ref={searchRef} className="relative">
                            <button
                                onClick={() => setSearchOpen(!searchOpen)}
                                className="p-2 rounded-lg text-foreground/60 hover:text-foreground hover:bg-accent transition-all"
                            >
                                <Search className="h-5 w-5" />
                            </button>

                            {searchOpen && (
                                <div className="absolute right-0 top-11 w-72 bg-background border border-border rounded-xl shadow-lg p-3 animate-in fade-in slide-in-from-top-2 duration-200">
                                    <form onSubmit={handleSearch} className="flex items-center gap-2">
                                        <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                        <input
                                            autoFocus
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Search food or restaurants..."
                                            className="flex-1 text-sm bg-transparent outline-none placeholder:text-muted-foreground"
                                        />
                                        {searchQuery && (
                                            <button type="button" onClick={() => setSearchQuery("")}>
                                                <X className="h-4 w-4 text-muted-foreground" />
                                            </button>
                                        )}
                                    </form>
                                </div>
                            )}
                        </div>

                        {/* Notifications */}
                        <Link
                            href="/user/notifications"
                            className="relative p-2 rounded-lg text-foreground/60 hover:text-foreground hover:bg-accent transition-all"
                        >
                            <Bell className="h-5 w-5" />
                            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-orange-500" />
                        </Link>

                        {/* Profile dropdown */}
                        <div ref={dropdownRef} className="relative">
                            <button
                                onClick={() => setProfileOpen(!profileOpen)}
                                className="flex items-center gap-1.5 pl-2 pr-1 py-1.5 rounded-lg hover:bg-accent transition-all"
                            >
                                <div className="h-7 w-7 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
                                    U
                                </div>
                                <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`} />
                            </button>

                            {profileOpen && (
                                <div className="absolute right-0 top-11 w-52 bg-background border border-border rounded-xl shadow-lg py-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div className="px-3 py-2 border-b border-border/50 mb-1">
                                        <p className="text-sm font-semibold">My Account</p>
                                        <p className="text-xs text-muted-foreground">Manage your profile</p>
                                    </div>
                                    <Link
                                        href="/user/profile"
                                        onClick={() => setProfileOpen(false)}
                                        className="flex items-center gap-2.5 px-3 py-2 text-sm text-foreground/70 hover:text-foreground hover:bg-accent transition-all"
                                    >
                                        <User className="h-4 w-4" />
                                        Profile
                                    </Link>
                                    <Link
                                        href="/user/profile/edit"
                                        onClick={() => setProfileOpen(false)}
                                        className="flex items-center gap-2.5 px-3 py-2 text-sm text-foreground/70 hover:text-foreground hover:bg-accent transition-all"
                                    >
                                        <Settings className="h-4 w-4" />
                                        Edit Profile
                                    </Link>
                                    <div className="h-px bg-border/50 my-1" />
                                    <button
                                        onClick={onLogout}
                                        className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        Log out
                                    </button>
                                </div>
                            )}
                        </div>

                    </div>
                </div>

                {/* Mobile nav links */}
                <div className="md:hidden flex items-center gap-1 pb-2 overflow-x-auto">
                    {NAV_LINKS.map(({ href, label, icon: Icon }) => (
                        <Link
                            key={href}
                            href={href}
                            className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${isActive(href)
                                    ? "text-orange-600 bg-orange-50 dark:bg-orange-900/20"
                                    : "text-foreground/60 hover:text-foreground"
                                }`}
                        >
                            <Icon className="h-3.5 w-3.5" />
                            {label}
                        </Link>
                    ))}
                </div>
            </nav>
        </header>
    );
}
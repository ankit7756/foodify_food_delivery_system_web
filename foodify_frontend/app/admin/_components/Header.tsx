"use client";
import Link from "next/link";
import { handleLogout } from "@/app/lib/actions/auth-action";

export default function Header() {
    return (
        <header className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-black/10 dark:border-white/10">
            <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Global">
                <div className="flex h-16 items-center justify-between">
                    {/* Left: Logo & Title */}
                    <div className="flex items-center gap-3">
                        <Link href="/admin" className="flex items-center gap-2 group">
                            <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-foreground text-background font-semibold">
                                A
                            </span>
                            <span className="text-base font-semibold tracking-tight group-hover:opacity-80 transition-opacity">
                                Admin Panel
                            </span>
                        </Link>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleLogout}
                            className="h-9 px-3 inline-flex items-center justify-center rounded-md border border-black/10 dark:border-white/15 text-sm font-medium hover:bg-foreground/5 transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </nav>
        </header>
    );
}
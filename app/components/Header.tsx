// // import Link from "next/link";
// // import ThemeToggle from "./ThemeToggle";

// // export default function Header() {
// //     return (
// //         <header className="border-b bg-background">
// //             <div className="container mx-auto px-4 py-4 flex justify-between items-center">
// //                 <Link href="/" className="text-xl font-bold">
// //                     Foodify
// //                 </Link>
// //                 <nav className="space-x-6">
// //                     <Link href="/" className="text-sm hover:underline">Home</Link>
// //                     <Link href="/login" className="text-sm hover:underline">Login</Link>
// //                     <Link href="/register" className="text-sm hover:underline">Register</Link>
// //                     <ThemeToggle />
// //                 </nav>
// //             </div>
// //         </header>
// //     );
// // }

// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { useState } from "react";
// import ThemeToggle from "./ThemeToggle";

// const NAV_LINKS = [
//     { href: "/", label: "Home" },
//     { href: "/about", label: "About" },  // ← ADD THIS
//     // Add more later if needed, e.g. { href: "/about", label: "About" }
// ];

// export default function Header() {
//     const pathname = usePathname();
//     const [mobileOpen, setMobileOpen] = useState(false);

//     const isActive = (href: string) =>
//         href === "/" ? pathname === "/" : pathname.startsWith(href);

//     return (
//         <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 border-b border-border">
//             <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//                 <div className="flex h-16 items-center justify-between">
//                     {/* Logo */}
//                     <div className="flex items-center">
//                         <Link href="/" className="flex items-center gap-3 group">
//                             <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-pink-600 text-white font-bold text-xl shadow-md">
//                                 F
//                             </div>
//                             <span className="text-xl font-bold tracking-tight group-hover:opacity-80 transition">
//                                 Foodify
//                             </span>
//                         </Link>
//                     </div>

//                     {/* Desktop Nav Links (centered-ish) */}
//                     <div className="hidden md:flex items-center justify-center flex-1">
//                         <div className="flex items-center gap-8">
//                             {NAV_LINKS.map((link) => (
//                                 <Link
//                                     key={link.href}
//                                     href={link.href}
//                                     className={`text-sm font-medium transition-colors hover:text-foreground ${isActive(link.href) ? "text-foreground" : "text-foreground/60"
//                                         }`}
//                                 >
//                                     {link.label}
//                                 </Link>
//                             ))}
//                         </div>
//                     </div>

//                     {/* Right Side: Auth Buttons + Theme + Mobile Menu */}
//                     <div className="flex items-center gap-4">
//                         {/* Desktop Auth Buttons */}
//                         <div className="hidden sm:flex items-center gap-3">
//                             <Link
//                                 href="/login"
//                                 className="px-4 py-2 text-sm font-medium rounded-lg border border-border hover:bg-accent transition"
//                             >
//                                 Log in
//                             </Link>
//                             <Link
//                                 href="/register"
//                                 className="px-4 py-2 text-sm font-semibold rounded-lg bg-foreground text-background hover:opacity-90 transition shadow-sm"
//                             >
//                                 Sign up
//                             </Link>
//                         </div>

//                         <ThemeToggle />

//                         {/* Mobile Hamburger */}
//                         <button
//                             onClick={() => setMobileOpen(!mobileOpen)}
//                             className="md:hidden p-2 rounded-lg hover:bg-accent transition"
//                             aria-label="Toggle mobile menu"
//                         >
//                             {mobileOpen ? (
//                                 <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                                 </svg>
//                             ) : (
//                                 <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//                                 </svg>
//                             )}
//                         </button>
//                     </div>
//                 </div>

//                 {/* Mobile Menu Panel */}
//                 {mobileOpen && (
//                     <div className="md:hidden py-4 border-t border-border">
//                         <div className="flex flex-col gap-4">
//                             {NAV_LINKS.map((link) => (
//                                 <Link
//                                     key={link.href}
//                                     href={link.href}
//                                     onClick={() => setMobileOpen(false)}
//                                     className={`px-3 py-2 text-sm font-medium rounded-lg transition ${isActive(link.href)
//                                         ? "bg-accent text-foreground"
//                                         : "text-foreground/70 hover:bg-accent"
//                                         }`}
//                                 >
//                                     {link.label}
//                                 </Link>
//                             ))}
//                             <div className="flex flex-col gap-3 pt-2">
//                                 <Link
//                                     href="/login"
//                                     onClick={() => setMobileOpen(false)}
//                                     className="px-4 py-2 text-sm font-medium text-center rounded-lg border border-border hover:bg-accent transition"
//                                 >
//                                     Log in
//                                 </Link>
//                                 <Link
//                                     href="/register"
//                                     onClick={() => setMobileOpen(false)}
//                                     className="px-4 py-2 text-sm font-semibold text-center rounded-lg bg-foreground text-background hover:opacity-90 transition"
//                                 >
//                                     Sign up
//                                 </Link>
//                             </div>
//                         </div>
//                     </div>
//                 )}
//             </nav>
//         </header>
//     );
// }

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import ThemeToggle from "./ThemeToggle";

const NAV_LINKS = [
    { href: "/", label: "Home", icon: "🏠" },
    { href: "/about", label: "About", icon: "ℹ️" },
];

export default function Header() {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const isActive = (href: string) =>
        href === "/" ? pathname === "/" : pathname.startsWith(href);

    return (
        <header
            className={`sticky top-0 z-50 transition-all duration-300 ${scrolled
                ? "bg-background/95 backdrop-blur-lg shadow-lg border-b border-border"
                : "bg-background/80 backdrop-blur-md border-b border-border/50"
                }`}
        >
            <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 via-pink-500 to-pink-600 text-white font-bold text-xl shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300">
                                <span className="relative z-10">F</span>
                                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-orange-400 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity blur-sm"></div>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent group-hover:from-orange-600 group-hover:to-pink-700 transition-all">
                                    Foodify
                                </span>
                                <span className="text-[10px] text-muted-foreground font-medium -mt-1">
                                    Food Delivered Fast
                                </span>
                            </div>
                        </Link>
                    </div>

                    <div className="hidden md:flex items-center justify-center flex-1">
                        <div className="flex items-center gap-2 bg-muted/50 rounded-full p-1">
                            {NAV_LINKS.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`flex items-center gap-2 px-5 py-2 text-sm font-medium rounded-full transition-all duration-300 ${isActive(link.href)
                                        ? "bg-background text-foreground shadow-md"
                                        : "text-foreground/60 hover:text-foreground hover:bg-background/50"
                                        }`}
                                >
                                    <span className="text-base">{link.icon}</span>
                                    <span>{link.label}</span>
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="hidden sm:flex items-center gap-3">
                            <Link
                                href="/login"
                                className="px-5 py-2 text-sm font-medium rounded-full border border-border hover:bg-accent hover:border-foreground/20 transition-all duration-300"
                            >
                                Log in
                            </Link>
                            <Link
                                href="/register"
                                className="px-5 py-2 text-sm font-semibold rounded-full bg-gradient-to-r from-orange-500 to-pink-600 text-white hover:from-orange-600 hover:to-pink-700 transition-all duration-300 shadow-md hover:shadow-lg"
                            >
                                Sign up
                            </Link>
                        </div>

                        <div className="hidden sm:block w-px h-6 bg-border"></div>

                        <ThemeToggle />

                        <button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className="md:hidden p-2 rounded-lg hover:bg-accent transition-colors"
                            aria-label="Toggle mobile menu"
                        >
                            <div className="relative w-6 h-6">
                                <span
                                    className={`absolute block h-0.5 w-6 bg-current transform transition-all duration-300 ${mobileOpen ? "rotate-45 top-3" : "top-1"
                                        }`}
                                ></span>
                                <span
                                    className={`absolute block h-0.5 w-6 bg-current top-3 transition-all duration-300 ${mobileOpen ? "opacity-0" : "opacity-100"
                                        }`}
                                ></span>
                                <span
                                    className={`absolute block h-0.5 w-6 bg-current transform transition-all duration-300 ${mobileOpen ? "-rotate-45 top-3" : "top-5"
                                        }`}
                                ></span>
                            </div>
                        </button>
                    </div>
                </div>

                <div
                    className={`md:hidden overflow-hidden transition-all duration-300 ${mobileOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                        }`}
                >
                    <div className="py-4 border-t border-border">
                        <div className="flex flex-col gap-2">
                            {NAV_LINKS.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setMobileOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 ${isActive(link.href)
                                        ? "bg-gradient-to-r from-orange-500/10 to-pink-600/10 text-foreground border-l-4 border-orange-500"
                                        : "text-foreground/70 hover:bg-accent hover:text-foreground"
                                        }`}
                                >
                                    <span className="text-xl">{link.icon}</span>
                                    <span>{link.label}</span>
                                </Link>
                            ))}

                            <div className="h-px bg-border my-2"></div>

                            <div className="flex flex-col gap-3">
                                <Link
                                    href="/login"
                                    onClick={() => setMobileOpen(false)}
                                    className="px-4 py-3 text-sm font-medium text-center rounded-xl border border-border hover:bg-accent transition-all duration-300"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href="/register"
                                    onClick={() => setMobileOpen(false)}
                                    className="px-4 py-3 text-sm font-semibold text-center rounded-xl bg-gradient-to-r from-orange-500 to-pink-600 text-white hover:from-orange-600 hover:to-pink-700 transition-all duration-300 shadow-md"
                                >
                                    Sign up
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
}
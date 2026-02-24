"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle, ShoppingBag, Home, UtensilsCrossed } from "lucide-react";
import { Suspense } from "react";

function SuccessContent() {
    const params = useSearchParams();
    const method = params.get("method"); // "cod" or "khalti"
    const isKhalti = method === "khalti";

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center">

            {/* Icon */}
            <div className="relative mb-8">
                <div className="h-28 w-28 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto">
                    <CheckCircle className="h-16 w-16 text-green-500" />
                </div>
                {isKhalti && (
                    <div className="absolute -bottom-2 -right-2 bg-[#5C2D91] rounded-full px-2 py-0.5">
                        <span className="text-white text-xs font-bold">Khalti</span>
                    </div>
                )}
            </div>

            <h1 className="text-3xl md:text-4xl font-extrabold mb-3">Order Placed! 🎉</h1>
            <p className="text-muted-foreground max-w-sm mb-2 leading-relaxed">
                Your order has been successfully placed and is being confirmed by the restaurant.
            </p>
            {isKhalti && (
                <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-full px-4 py-2 mb-4">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-green-700 dark:text-green-400 font-medium">
                        Payment via Khalti confirmed
                    </span>
                </div>
            )}

            {/* Timeline */}
            <div className="w-full max-w-xs mt-4 mb-8 space-y-3">
                {[
                    { label: "Order Received", done: true },
                    { label: "Restaurant Preparing", done: false },
                    { label: "Out for Delivery", done: false },
                    { label: "Delivered", done: false },
                ].map((step, i) => (
                    <div key={i} className="flex items-center gap-3">
                        <div className={`h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0 ${step.done ? "bg-green-500" : "bg-muted border-2 border-border"
                            }`}>
                            {step.done && <CheckCircle className="h-3 w-3 text-white" />}
                        </div>
                        <div className={`flex-1 h-px ${i < 3 ? (step.done ? "bg-green-300" : "bg-border") : ""}`} />
                        <span className={`text-sm ${step.done ? "font-semibold text-green-600 dark:text-green-400" : "text-muted-foreground"}`}>
                            {step.label}
                        </span>
                    </div>
                ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
                <Link
                    href="/user/orders"
                    className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-pink-600 text-white font-bold hover:from-orange-600 hover:to-pink-700 shadow-md transition-all"
                >
                    <ShoppingBag className="h-5 w-5" />
                    Track Order
                </Link>
                <Link
                    href="/user/dashboard"
                    className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border-2 border-border text-foreground/70 font-semibold hover:bg-accent transition-all"
                >
                    <Home className="h-4 w-4" />
                    Back to Home
                </Link>
            </div>
        </div>
    );
}

export default function SuccessPage() {
    return (
        <Suspense fallback={<div className="min-h-[80vh] flex items-center justify-center">Loading...</div>}>
            <SuccessContent />
        </Suspense>
    );
}
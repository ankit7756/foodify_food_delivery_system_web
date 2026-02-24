"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
    MapPin, Phone, ChevronRight, CheckCircle2,
    Banknote, CreditCard, ShoppingBag, Truck, Tag
} from "lucide-react";
import { useCartStore, cartSubtotal, cartItemCount } from "@/store/cartStore";
import { createOrder } from "@/lib/api/order-api";

const DELIVERY_FEE = 50;

type PaymentMethod = "Cash on Delivery" | "Khalti";

export default function CheckoutPage() {
    const router = useRouter();
    const { items, restaurantId, restaurantName, clearCart } = useCartStore();
    const [address, setAddress] = useState("Patan, Bagmati Province, Nepal");
    const [phone, setPhone] = useState("9800000001");
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("Cash on Delivery");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const subtotal = cartSubtotal(items);
    const total = subtotal + DELIVERY_FEE;
    const count = cartItemCount(items);

    // Redirect if cart is empty
    if (items.length === 0) {
        router.replace("/user/cart");
        return null;
    }

    const handlePlaceOrder = async () => {
        if (!address.trim() || !phone.trim()) {
            setError("Please fill in delivery address and phone number.");
            return;
        }
        if (!restaurantId || !restaurantName) {
            setError("Something went wrong with your cart. Please try again.");
            return;
        }

        // Khalti → go to Khalti payment page
        if (paymentMethod === "Khalti") {
            router.push("/user/checkout/khalti");
            return;
        }

        // Cash on Delivery → place order directly
        setLoading(true);
        setError(null);

        try {
            await createOrder({
                restaurantId,
                restaurantName,
                items: items.map((i) => ({
                    foodId: i.foodId,
                    name: i.name,
                    price: i.price,
                    quantity: i.quantity,
                    image: i.image,
                })),
                subtotal,
                deliveryFee: DELIVERY_FEE,
                totalAmount: total,
                deliveryAddress: address.trim(),
                phone: phone.trim(),
                paymentMethod: "Cash on Delivery",
            });

            clearCart();
            router.push("/user/checkout/success?method=cod");
        } catch (err: any) {
            setError(err.message || "Failed to place order. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-muted/30">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl md:text-3xl font-extrabold">Checkout</h1>
                    <p className="text-muted-foreground text-sm mt-1">Complete your order details</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">

                    {/* ── Left: Form ── */}
                    <div className="lg:col-span-3 space-y-5">

                        {/* Delivery Address */}
                        <div className="bg-background border border-border rounded-2xl p-5 space-y-4">
                            <h2 className="font-bold text-base flex items-center gap-2">
                                <MapPin className="h-5 w-5 text-orange-500" />
                                Delivery Address
                            </h2>
                            <textarea
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                rows={2}
                                placeholder="Enter your delivery address"
                                className="w-full rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none placeholder:text-muted-foreground"
                            />
                        </div>

                        {/* Phone */}
                        <div className="bg-background border border-border rounded-2xl p-5 space-y-4">
                            <h2 className="font-bold text-base flex items-center gap-2">
                                <Phone className="h-5 w-5 text-orange-500" />
                                Phone Number
                            </h2>
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="98XXXXXXXX"
                                className="w-full rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder:text-muted-foreground"
                            />
                        </div>

                        {/* Payment Method */}
                        <div className="bg-background border border-border rounded-2xl p-5 space-y-4">
                            <h2 className="font-bold text-base flex items-center gap-2">
                                <CreditCard className="h-5 w-5 text-orange-500" />
                                Payment Method
                            </h2>

                            <div className="space-y-3">
                                {/* Cash on Delivery */}
                                <button
                                    onClick={() => setPaymentMethod("Cash on Delivery")}
                                    className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 ${paymentMethod === "Cash on Delivery"
                                            ? "border-orange-500 bg-orange-50 dark:bg-orange-900/20"
                                            : "border-border hover:border-orange-300"
                                        }`}
                                >
                                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 ${paymentMethod === "Cash on Delivery" ? "bg-orange-500 text-white" : "bg-muted text-muted-foreground"
                                        }`}>
                                        <Banknote className="h-5 w-5" />
                                    </div>
                                    <div className="flex-1 text-left">
                                        <p className={`font-semibold text-sm ${paymentMethod === "Cash on Delivery" ? "text-orange-600 dark:text-orange-400" : ""}`}>
                                            Cash on Delivery
                                        </p>
                                        <p className="text-xs text-muted-foreground">Pay when your order arrives</p>
                                    </div>
                                    {paymentMethod === "Cash on Delivery" && (
                                        <CheckCircle2 className="h-5 w-5 text-orange-500 flex-shrink-0" />
                                    )}
                                </button>

                                {/* Khalti */}
                                <button
                                    onClick={() => setPaymentMethod("Khalti")}
                                    className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 ${paymentMethod === "Khalti"
                                            ? "border-[#5C2D91] bg-purple-50 dark:bg-purple-900/20"
                                            : "border-border hover:border-purple-300"
                                        }`}
                                >
                                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 ${paymentMethod === "Khalti" ? "bg-[#5C2D91] text-white" : "bg-muted text-muted-foreground"
                                        }`}>
                                        <span className="text-xs font-bold">K</span>
                                    </div>
                                    <div className="flex-1 text-left">
                                        <p className={`font-semibold text-sm ${paymentMethod === "Khalti" ? "text-[#5C2D91]" : ""}`}>
                                            Khalti Digital Wallet
                                        </p>
                                        <p className="text-xs text-muted-foreground">Fast & secure digital payment</p>
                                    </div>
                                    {paymentMethod === "Khalti" && (
                                        <CheckCircle2 className="h-5 w-5 text-[#5C2D91] flex-shrink-0" />
                                    )}
                                </button>
                            </div>

                            {paymentMethod === "Khalti" && (
                                <div className="flex items-start gap-2 bg-purple-50 dark:bg-purple-900/20 rounded-xl px-3 py-2.5 text-xs text-purple-700 dark:text-purple-300">
                                    <span className="mt-0.5 flex-shrink-0">ℹ️</span>
                                    You'll be redirected to Khalti's payment screen. An OTP will be sent to your registered email to confirm the payment.
                                </div>
                            )}
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3 text-sm text-red-600 dark:text-red-400">
                                {error}
                            </div>
                        )}
                    </div>

                    {/* ── Right: Order Summary ── */}
                    <div className="lg:col-span-2">
                        <div className="bg-background border border-border rounded-2xl p-5 space-y-5 sticky top-24">

                            <h2 className="font-bold text-base flex items-center gap-2">
                                <ShoppingBag className="h-5 w-5 text-orange-500" />
                                Order Summary
                            </h2>

                            {/* Restaurant */}
                            <div className="flex items-center gap-2 py-2 border-b border-border">
                                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                    {restaurantName?.[0] ?? "R"}
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">From</p>
                                    <p className="font-semibold text-sm">{restaurantName}</p>
                                </div>
                            </div>

                            {/* Items */}
                            <div className="space-y-3 max-h-60 overflow-y-auto">
                                {items.map((item) => (
                                    <div key={item.foodId} className="flex items-center gap-3">
                                        <div className="relative h-10 w-10 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
                                            <Image src={item.image} alt={item.name} fill className="object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">{item.name}</p>
                                            <p className="text-xs text-muted-foreground">× {item.quantity}</p>
                                        </div>
                                        <span className="text-sm font-semibold tabular-nums flex-shrink-0">
                                            Rs. {item.price * item.quantity}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Bill */}
                            <div className="space-y-2.5 pt-2 border-t border-border text-sm">
                                <div className="flex justify-between text-foreground/70">
                                    <span>Subtotal ({count} item{count !== 1 ? "s" : ""})</span>
                                    <span className="tabular-nums">Rs. {subtotal}</span>
                                </div>
                                <div className="flex justify-between text-foreground/70">
                                    <span className="flex items-center gap-1.5">
                                        <Truck className="h-3.5 w-3.5" />
                                        Delivery Fee
                                    </span>
                                    <span className="tabular-nums">Rs. {DELIVERY_FEE}</span>
                                </div>
                                <div className="flex justify-between font-bold text-base pt-1 border-t border-border">
                                    <span>Grand Total</span>
                                    <span className="text-orange-500 tabular-nums">Rs. {total}</span>
                                </div>
                            </div>

                            {/* Place order button */}
                            <button
                                onClick={handlePlaceOrder}
                                disabled={loading}
                                className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-base shadow-md transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed ${paymentMethod === "Khalti"
                                        ? "bg-[#5C2D91] hover:bg-[#4a2275] text-white"
                                        : "bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white"
                                    }`}
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                        </svg>
                                        Placing Order...
                                    </span>
                                ) : paymentMethod === "Khalti" ? (
                                    <>
                                        <span className="text-sm font-black tracking-wide">K</span>
                                        Pay with Khalti · Rs. {total}
                                    </>
                                ) : (
                                    <>
                                        Place Order · Rs. {total}
                                        <ChevronRight className="h-4 w-4" />
                                    </>
                                )}
                            </button>

                            <p className="text-center text-xs text-muted-foreground">
                                🔒 Your payment information is secure
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
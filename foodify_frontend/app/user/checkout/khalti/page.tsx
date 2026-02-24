"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Delete, Mail, CheckCircle, Loader2, ChevronLeft } from "lucide-react";
import { useCartStore, cartSubtotal } from "@/store/cartStore";
import { sendKhaltiOTP, verifyKhaltiOTP, createOrder } from "@/lib/api/order-api";

const DELIVERY_FEE = 50;

type Step = "mpin" | "otp" | "processing" | "success";

const NUMPAD = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "del"];

export default function KhaltiPaymentPage() {
    const router = useRouter();
    const { items, restaurantId, restaurantName, clearCart } = useCartStore();

    const subtotal = cartSubtotal(items);
    const total = subtotal + DELIVERY_FEE;

    const [step, setStep] = useState<Step>("mpin");
    const [phone, setPhone] = useState("9800000001");
    const [mpin, setMpin] = useState("");
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Stored checkout details from session (passed via URL or stored elsewhere)
    // For simplicity we read from the cart store and use default address
    const [address] = useState("Patan, Bagmati Province, Nepal");
    const [userPhone] = useState("9800000001");

    if (items.length === 0) {
        router.replace("/user/cart");
        return null;
    }

    const handleMpinKey = (key: string) => {
        if (key === "del") {
            setMpin((p) => p.slice(0, -1));
        } else if (mpin.length < 4) {
            setMpin((p) => p + key);
        }
    };

    const handleSendOTP = async () => {
        if (phone.trim().length < 10) {
            setError("Enter a valid phone number");
            return;
        }
        if (mpin.length < 4) {
            setError("Enter your 4-digit MPIN");
            return;
        }
        setLoading(true);
        setError(null);
        try {
            await sendKhaltiOTP({
                phone: phone.trim(),
                amount: total.toString(),
                restaurantName: restaurantName ?? "Restaurant",
            });
            setStep("otp");
        } catch {
            setError("Failed to send OTP. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async () => {
        if (otp.length !== 6) {
            setError("Enter the 6-digit OTP");
            return;
        }
        setLoading(true);
        setError(null);
        setStep("processing");

        try {
            await verifyKhaltiOTP(otp);

            // OTP correct — place the order
            await createOrder({
                restaurantId: restaurantId!,
                restaurantName: restaurantName!,
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
                deliveryAddress: address,
                phone: userPhone,
                paymentMethod: "Khalti",
            });

            setStep("success");
            setTimeout(() => {
                clearCart();
                router.push("/user/checkout/success?method=khalti");
            }, 2500);

        } catch (err: any) {
            setStep("otp");
            setError(err.response?.data?.message || err.message || "Invalid OTP. Please try again.");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col" style={{ background: "#5C2D91" }}>

            {/* ── Purple top bar ── */}
            <div className="px-4 pt-4 pb-6">
                <div className="flex items-center gap-3 mb-6">
                    {step !== "processing" && step !== "success" && (
                        <button
                            onClick={() => {
                                if (step === "otp") { setStep("mpin"); setOtp(""); setError(null); }
                                else router.back();
                            }}
                            className="p-2 rounded-xl hover:bg-white/10 transition-colors text-white"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                    )}
                    <div className="flex items-center gap-2">
                        <div className="bg-white rounded-lg px-3 py-1">
                            <span className="text-[#5C2D91] font-black text-sm tracking-wide">Khalti</span>
                        </div>
                        <span className="text-white/60 text-sm">Secure Payment</span>
                    </div>
                </div>

                {/* Amount */}
                <div className="text-center">
                    <p className="text-white/60 text-sm mb-1">Amount to Pay</p>
                    <p className="text-white font-extrabold text-4xl tabular-nums">Rs. {total}</p>
                    <p className="text-white/50 text-xs mt-1">to {restaurantName}</p>
                </div>
            </div>

            {/* ── White content card ── */}
            <div className="flex-1 bg-background rounded-t-3xl overflow-hidden">

                {/* MPIN step */}
                {step === "mpin" && (
                    <div className="p-6 space-y-6">
                        <div>
                            <h2 className="text-lg font-bold">Enter Khalti details</h2>
                            <p className="text-sm text-muted-foreground mt-0.5">Use your registered Khalti number and MPIN</p>
                        </div>

                        {/* Phone */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold">Khalti Phone Number</label>
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="98XXXXXXXX"
                                className="w-full rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#5C2D91]"
                            />
                        </div>

                        {/* MPIN label */}
                        <div className="space-y-3">
                            <label className="text-sm font-semibold">MPIN</label>
                            <p className="text-xs text-muted-foreground -mt-2">Enter your 4-digit Khalti MPIN</p>

                            {/* PIN dots */}
                            <div className="flex items-center justify-center gap-5 py-2">
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <div
                                        key={i}
                                        className={`h-4 w-4 rounded-full border-2 transition-all duration-200 ${i < mpin.length
                                                ? "bg-[#5C2D91] border-[#5C2D91]"
                                                : "bg-transparent border-border"
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-4 py-2.5 text-sm text-red-600 dark:text-red-400">
                                {error}
                            </div>
                        )}

                        {/* Numpad */}
                        <div className="grid grid-cols-3 gap-3">
                            {NUMPAD.map((key, i) => {
                                if (key === "") return <div key={i} />;
                                return (
                                    <button
                                        key={i}
                                        onClick={() => handleMpinKey(key)}
                                        className={`h-14 rounded-xl flex items-center justify-center transition-all ${key === "del"
                                                ? "bg-muted/50 hover:bg-muted"
                                                : "bg-muted/40 hover:bg-muted active:scale-95"
                                            }`}
                                    >
                                        {key === "del" ? (
                                            <Delete className="h-5 w-5 text-foreground/60" />
                                        ) : (
                                            <span className="text-xl font-semibold">{key}</span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        <button
                            onClick={handleSendOTP}
                            disabled={loading}
                            className="w-full py-4 rounded-xl bg-[#5C2D91] text-white font-bold hover:bg-[#4a2275] disabled:opacity-70 transition-all flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                            Continue
                        </button>

                        <p className="text-center text-xs text-muted-foreground flex items-center justify-center gap-1">
                            🔒 256-bit SSL Secured Payment
                        </p>
                    </div>
                )}

                {/* OTP step */}
                {step === "otp" && (
                    <div className="p-6 space-y-6 flex flex-col items-center">
                        <div className="h-16 w-16 rounded-2xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mt-2">
                            <Mail className="h-8 w-8 text-[#5C2D91]" />
                        </div>

                        <div className="text-center">
                            <h2 className="text-xl font-bold">OTP Verification</h2>
                            <p className="text-sm text-muted-foreground mt-2 max-w-xs leading-relaxed">
                                A 6-digit OTP has been sent to your registered email. Check your inbox to confirm the payment.
                            </p>
                        </div>

                        <input
                            type="number"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.slice(0, 6))}
                            placeholder="Enter 6-digit OTP"
                            className="w-full text-center text-3xl font-bold tracking-[0.5em] rounded-xl border border-border bg-muted/30 px-4 py-4 focus:outline-none focus:ring-2 focus:ring-[#5C2D91] placeholder:text-lg placeholder:tracking-normal placeholder:font-normal"
                            style={{ letterSpacing: otp ? "0.5em" : undefined }}
                        />

                        {error && (
                            <div className="w-full bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-4 py-2.5 text-sm text-red-600 dark:text-red-400">
                                {error}
                            </div>
                        )}

                        <button
                            onClick={handleVerifyOTP}
                            disabled={loading}
                            className="w-full py-4 rounded-xl bg-[#5C2D91] text-white font-bold hover:bg-[#4a2275] disabled:opacity-70 transition-all flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                            Verify & Pay
                        </button>

                        <button
                            onClick={() => {
                                setStep("mpin");
                                setOtp("");
                                setError(null);
                                setMpin("");
                            }}
                            className="text-sm text-[#5C2D91] font-semibold hover:underline"
                        >
                            Resend OTP
                        </button>
                    </div>
                )}

                {/* Processing step */}
                {step === "processing" && (
                    <div className="flex flex-col items-center justify-center p-12 space-y-5 min-h-64">
                        <Loader2 className="h-12 w-12 text-[#5C2D91] animate-spin" />
                        <div className="text-center">
                            <p className="text-lg font-bold">Processing Payment...</p>
                            <p className="text-sm text-muted-foreground mt-1">Please do not close this screen</p>
                        </div>
                    </div>
                )}

                {/* Success step */}
                {step === "success" && (
                    <div className="flex flex-col items-center justify-center p-12 space-y-5 min-h-64">
                        <div className="h-20 w-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center animate-bounce-once">
                            <CheckCircle className="h-12 w-12 text-green-500" />
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-extrabold text-green-600">Payment Successful!</p>
                            <p className="text-muted-foreground mt-2 tabular-nums">Rs. {total} paid to {restaurantName}</p>
                            <p className="text-sm text-muted-foreground mt-1">Placing your order...</p>
                        </div>
                        <Loader2 className="h-5 w-5 text-muted-foreground animate-spin" />
                    </div>
                )}
            </div>
        </div>
    );
}
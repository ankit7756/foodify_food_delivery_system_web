import Image from "next/image";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <section className="h-screen">
            <div className="h-full w-full grid md:grid-cols-2 md:gap-0">
                {/* Left side - Illustration */}
                <div className="relative hidden md:flex items-center justify-center bg-gradient-to-br from-orange-500 via-pink-500 to-pink-600 overflow-hidden">
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="relative z-10 text-white text-center p-8">
                        <h1 className="text-5xl font-bold mb-4">Welcome to Foodify! 🍕</h1>
                        <p className="text-xl opacity-90">Delicious food delivered to your doorstep</p>
                    </div>
                </div>

                {/* Right side - Form */}
                <div className="flex h-full items-center justify-center px-4 md:px-10 bg-background">
                    <div className="w-full max-w-md rounded-xl border border-border bg-card p-8 shadow-lg">
                        {children}
                    </div>
                </div>
            </div>
        </section>
    );
}
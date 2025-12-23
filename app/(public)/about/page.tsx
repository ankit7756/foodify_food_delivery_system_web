import Link from "next/link";

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-6 py-16 max-w-4xl">
                {/* Hero Section */}
                <div className="text-center mb-16">
                    <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent mb-6">
                        About Foodify
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Your go-to platform for discovering and ordering delicious food from the best local restaurants.
                    </p>
                </div>

                {/* Mission & Story */}
                <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
                    <div>
                        <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            At Foodify, we believe great food brings people together. We're passionate about connecting hungry customers with amazing local eateries, making food delivery fast, reliable, and delightful.
                        </p>
                    </div>
                    <div className="bg-gradient-to-br from-orange-100 to-pink-100 dark:from-orange-900/20 dark:to-pink-900/20 rounded-2xl shadow-xl p-10 text-center">
                        <div className="text-6xl font-bold text-orange-600 dark:text-orange-400">500+</div>
                        <p className="text-xl mt-2">Restaurants Partnered</p>
                    </div>
                </div>

                {/* Features/Grid */}
                <div className="mb-20">
                    <h2 className="text-3xl font-bold text-center mb-10">Why Choose Foodify?</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-card rounded-xl shadow-md p-8 text-center border border-border">
                            <div className="text-4xl mb-4">🚀</div>
                            <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
                            <p className="text-muted-foreground">Hot food delivered in under 30 minutes</p>
                        </div>
                        <div className="bg-card rounded-xl shadow-md p-8 text-center border border-border">
                            <div className="text-4xl mb-4">🍕</div>
                            <h3 className="text-xl font-semibold mb-2">Wide Variety</h3>
                            <p className="text-muted-foreground">From pizza to sushi – something for everyone</p>
                        </div>
                        <div className="bg-card rounded-xl shadow-md p-8 text-center border border-border">
                            <div className="text-4xl mb-4">💳</div>
                            <h3 className="text-xl font-semibold mb-2">Easy Payments</h3>
                            <p className="text-muted-foreground">Secure checkout with multiple options</p>
                        </div>
                    </div>
                </div>

                {/* Call to Action */}
                <div className="text-center">
                    <p className="text-lg text-muted-foreground mb-8">
                        Ready to explore amazing food?
                    </p>
                    <Link
                        href="/"
                        className="inline-block px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-600 text-white rounded-xl font-semibold text-lg hover:opacity-90 transition shadow-lg"
                    >
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
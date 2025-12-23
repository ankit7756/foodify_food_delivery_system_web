// export default function DashboardPage() {
//     return (
//         <div className="min-h-screen bg-background">
//             <div className="container mx-auto px-6 py-12 max-w-5xl">
//                 <div className="text-center mb-12">
//                     <h1 className="text-5xl font-bold bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent mb-4">
//                         Welcome to Your Dashboard! 🎉
//                     </h1>
//                     <p className="text-xl text-muted-foreground">
//                         You're successfully logged in to Foodify.
//                     </p>
//                 </div>

//                 {/* Dummy Stats Cards */}
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8 my-16">
//                     <div className="bg-card rounded-2xl shadow-lg p-8 border border-border text-center">
//                         <h3 className="text-4xl font-bold text-orange-600">42</h3>
//                         <p className="text-muted-foreground mt-2">Orders This Month</p>
//                     </div>
//                     <div className="bg-card rounded-2xl shadow-lg p-8 border border-border text-center">
//                         <h3 className="text-4xl font-bold text-pink-600">18</h3>
//                         <p className="text-muted-foreground mt-2">Favorite Restaurants</p>
//                     </div>
//                     <div className="bg-card rounded-2xl shadow-lg p-8 border border-border text-center">
//                         <h3 className="text-4xl font-bold text-purple-600">95%</h3>
//                         <p className="text-muted-foreground mt-2">Satisfaction Rate</p>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

import Link from "next/link";

export default function DashboardPage() {
    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-6xl">
                {/* Welcome Hero */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent mb-6">
                        Welcome Back! 🎉
                    </h1>
                    <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
                        You're logged into Foodify. Here's your quick overview.
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
                    <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl shadow-2xl p-10 text-white text-center hover:scale-105 transition-transform">
                        <h3 className="text-5xl font-bold">42</h3>
                        <p className="text-xl mt-4 opacity-90">Orders This Month</p>
                    </div>
                    <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-3xl shadow-2xl p-10 text-white text-center hover:scale-105 transition-transform">
                        <h3 className="text-5xl font-bold">18</h3>
                        <p className="text-xl mt-4 opacity-90">Favorite Restaurants</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl shadow-2xl p-10 text-white text-center hover:scale-105 transition-transform">
                        <h3 className="text-5xl font-bold">95%</h3>
                        <p className="text-xl mt-4 opacity-90">Satisfaction Rate</p>
                    </div>
                </div>

                {/* Dummy Activity Section */}
                <div className="bg-card rounded-3xl shadow-xl p-10 border border-border">
                    <h2 className="text-3xl font-bold mb-8 text-center">Recent Activity</h2>
                    <p className="text-center text-muted-foreground text-lg">
                        (Dummy content – your recent orders would show here in a real app!)
                    </p>
                </div>

                {/* Back CTA */}
                <div className="text-center mt-16">
                    <Link
                        href="/"
                        className="inline-block px-10 py-5 bg-gradient-to-r from-orange-500 to-pink-600 text-white rounded-2xl font-bold text-lg hover:opacity-90 transition shadow-xl"
                    >
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
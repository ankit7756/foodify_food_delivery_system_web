"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Star, ChevronLeft, ChevronRight, Loader2, MessageSquare } from "lucide-react";
import { adminGetReviews } from "@/lib/api/admin-api";

function StarRow({ stars }: { stars: number }) {
    return (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className={`h-3.5 w-3.5 ${s <= stars ? "fill-amber-400 text-amber-400" : "text-muted-foreground/25"}`} />
            ))}
        </div>
    );
}

const STAR_LABELS: Record<number, { label: string; color: string }> = {
    1: { label: "Terrible", color: "text-red-500" },
    2: { label: "Bad", color: "text-orange-500" },
    3: { label: "Okay", color: "text-amber-500" },
    4: { label: "Good", color: "text-lime-600" },
    5: { label: "Excellent", color: "text-green-600" },
};

export default function ReviewsPage() {
    const [reviews, setReviews] = useState<any[]>([]);
    const [pagination, setPagination] = useState({ page: 1, totalPages: 1, totalItems: 0 });
    const [loading, setLoading] = useState(true);

    const fetchReviews = async (page = 1) => {
        setLoading(true);
        try {
            const res = await adminGetReviews(String(page), "12");
            setReviews(res.data ?? []);
            setPagination(res.pagination ?? { page: 1, totalPages: 1, totalItems: 0 });
        } finally { setLoading(false); }
    };

    useEffect(() => { fetchReviews(1); }, []);

    // Overall stats
    const avgRating = reviews.length > 0
        ? (reviews.reduce((s, r) => s + r.stars, 0) / reviews.length).toFixed(1)
        : "—";

    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h1 className="text-2xl font-extrabold">Reviews</h1>
                    <p className="text-sm text-muted-foreground">All customer reviews across the platform</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-background border border-border rounded-xl px-4 py-2.5 shadow-sm text-center">
                        <p className="text-2xl font-extrabold text-orange-500">{avgRating}</p>
                        <p className="text-xs text-muted-foreground">Avg. Rating</p>
                    </div>
                    <div className="bg-background border border-border rounded-xl px-4 py-2.5 shadow-sm text-center">
                        <p className="text-2xl font-extrabold">{pagination.totalItems}</p>
                        <p className="text-xs text-muted-foreground">Total Reviews</p>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-orange-500" /></div>
            ) : reviews.length === 0 ? (
                <div className="text-center py-20 space-y-3">
                    <Star className="h-12 w-12 text-muted-foreground/30 mx-auto" />
                    <p className="text-muted-foreground">No reviews yet</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {reviews.map((review) => {
                            const rating = STAR_LABELS[review.stars] ?? STAR_LABELS[3];
                            return (
                                <div key={review._id}
                                    className="bg-background border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                    {/* Color strip */}
                                    <div className={`h-1 w-full ${review.stars >= 4 ? "bg-green-500" :
                                            review.stars === 3 ? "bg-amber-400" : "bg-red-400"
                                        }`} />

                                    <div className="p-4 space-y-3">
                                        {/* User + rating */}
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex items-center gap-2.5 min-w-0">
                                                <div className="h-9 w-9 rounded-full overflow-hidden bg-gradient-to-br from-orange-400 to-pink-500 flex-shrink-0 flex items-center justify-center text-white text-sm font-bold">
                                                    {review.userId?.profileImage ? (
                                                        <Image src={review.userId.profileImage} alt="" width={36} height={36} unoptimized className="object-cover w-full h-full" />
                                                    ) : (
                                                        review.userId?.fullName?.[0]?.toUpperCase() ?? "U"
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-bold truncate">{review.userId?.fullName ?? "Anonymous"}</p>
                                                    <p className="text-xs text-muted-foreground">@{review.userId?.username ?? "user"}</p>
                                                </div>
                                            </div>
                                            <StarRow stars={review.stars} />
                                        </div>

                                        {/* Restaurant */}
                                        <div className="flex items-center gap-2">
                                            <div className="h-6 w-6 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-500 text-xs font-bold flex-shrink-0">
                                                {review.restaurantName?.[0]}
                                            </div>
                                            <p className="text-xs font-medium text-muted-foreground truncate">{review.restaurantName}</p>
                                        </div>

                                        {/* Rating label */}
                                        <p className={`text-xs font-bold ${rating.color}`}>{rating.label}</p>

                                        {/* Message */}
                                        {review.message ? (
                                            <div className="bg-muted/40 rounded-xl px-3 py-2.5">
                                                <div className="flex gap-1.5 items-start">
                                                    <MessageSquare className="h-3 w-3 text-muted-foreground flex-shrink-0 mt-0.5" />
                                                    <p className="text-xs text-foreground/70 leading-relaxed italic line-clamp-3">"{review.message}"</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="text-xs text-muted-foreground italic">No message</p>
                                        )}

                                        {/* Food items */}
                                        {review.foodItems?.length > 0 && (
                                            <div className="flex flex-wrap gap-1">
                                                {review.foodItems.slice(0, 3).map((item: string, i: number) => (
                                                    <span key={i} className="text-[10px] bg-muted px-2 py-0.5 rounded-full text-muted-foreground">{item}</span>
                                                ))}
                                                {review.foodItems.length > 3 && (
                                                    <span className="text-[10px] bg-muted px-2 py-0.5 rounded-full text-muted-foreground">+{review.foodItems.length - 3}</span>
                                                )}
                                            </div>
                                        )}

                                        {/* Date */}
                                        <p className="text-[10px] text-muted-foreground/60 pt-1 border-t border-border/40">
                                            {new Date(review.createdAt).toLocaleDateString("en-NP", { year: "numeric", month: "short", day: "numeric" })}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Pagination */}
                    {pagination.totalPages > 1 && (
                        <div className="flex items-center justify-center gap-1 pt-2">
                            <button onClick={() => fetchReviews(pagination.page - 1)} disabled={pagination.page === 1}
                                className="p-1.5 rounded-lg hover:bg-accent disabled:opacity-40"><ChevronLeft className="h-4 w-4" /></button>
                            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                                <button key={p} onClick={() => fetchReviews(p)}
                                    className={`h-7 w-7 rounded-lg text-xs font-semibold ${p === pagination.page ? "bg-orange-500 text-white" : "hover:bg-accent"}`}>{p}</button>
                            ))}
                            <button onClick={() => fetchReviews(pagination.page + 1)} disabled={pagination.page === pagination.totalPages}
                                className="p-1.5 rounded-lg hover:bg-accent disabled:opacity-40"><ChevronRight className="h-4 w-4" /></button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
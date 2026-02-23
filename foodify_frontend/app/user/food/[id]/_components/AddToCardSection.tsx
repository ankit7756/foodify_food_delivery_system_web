"use client";

import { useState } from "react";
import { ShoppingCart, Plus, Minus } from "lucide-react";
// import { Food } from "@/lib/api/food-restaurant-api";
import { Food } from "@/lib/api/food-restaurant-api";
import { toast } from "react-toastify";

export default function AddToCartSection({ food }: { food: Food }) {
    const [quantity, setQuantity] = useState(1);

    const increment = () => setQuantity((q) => q + 1);
    const decrement = () => setQuantity((q) => Math.max(1, q - 1));
    const total = food.price * quantity;

    const handleAddToCart = () => {
        // Cart logic will be wired here when we build cart context
        toast.success(`${food.name} × ${quantity} added to cart!`);
    };

    return (
        <div className="space-y-5">
            {/* Quantity selector */}
            <div className="space-y-2">
                <p className="text-sm font-semibold">Quantity</p>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3 bg-muted/50 rounded-xl p-1">
                        <button
                            onClick={decrement}
                            disabled={quantity <= 1}
                            className="h-8 w-8 rounded-lg flex items-center justify-center text-foreground hover:bg-background disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                        >
                            <Minus className="h-4 w-4" />
                        </button>
                        <span className="text-lg font-bold w-6 text-center">{quantity}</span>
                        <button
                            onClick={increment}
                            className="h-8 w-8 rounded-lg flex items-center justify-center bg-orange-500 text-white hover:bg-orange-600 transition-all"
                        >
                            <Plus className="h-4 w-4" />
                        </button>
                    </div>

                    <div className="text-right">
                        <p className="text-xs text-muted-foreground">Total</p>
                        <p className="text-2xl font-extrabold text-orange-500">Rs. {total}</p>
                    </div>
                </div>
            </div>

            {/* Add to cart button */}
            <button
                onClick={handleAddToCart}
                className="w-full flex items-center justify-center gap-2.5 py-4 rounded-xl bg-gradient-to-r from-orange-500 to-pink-600 text-white font-bold text-base hover:from-orange-600 hover:to-pink-700 shadow-md hover:shadow-lg hover:shadow-orange-200 dark:hover:shadow-orange-900/30 transition-all duration-200"
            >
                <ShoppingCart className="h-5 w-5" />
                Add to Cart · Rs. {total}
            </button>
        </div>
    );
}
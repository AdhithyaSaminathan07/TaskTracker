"use client";

import { useState, useEffect } from "react";
import { MealForm } from "@/components/meals/MealForm";
import { MealList } from "@/components/meals/MealList";
import { NutritionSummary } from "@/components/meals/NutritionSummary";
import { Loader2 } from "lucide-react";

export default function MealsPage() {
    const [meals, setMeals] = useState([]);
    const [loading, setLoading] = useState(true);

    async function fetchMeals() {
        try {
            const userData = JSON.parse(localStorage.getItem("user_data") || "{}");
            const res = await fetch("/api/meals?date=" + new Date().toISOString(), {
                headers: {
                    "x-user-id": userData.id || userData._id,
                },
            });
            const data = await res.json();
            if (data.success) {
                setMeals(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch meals", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchMeals();
    }, []);

    return (
        <div className="mx-auto max-w-2xl space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Meal Tracker</h1>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        Monitor your daily nutrition intake
                    </p>
                </div>
            </div>

            {/* Nutrition Overview */}
            <NutritionSummary meals={meals} />

            {/* Add Meal Form */}
            <MealForm onMealAdded={fetchMeals} />

            {/* Meal List */}
            <div className="space-y-4">
                <h3 className="font-semibold text-zinc-900 dark:text-white">Today&apos;s Meals</h3>
                {loading ? (
                    <div className="flex justify-center p-8">
                        <Loader2 className="h-6 w-6 animate-spin text-purple-600" />
                    </div>
                ) : (
                    <MealList meals={meals} />
                )}
            </div>
        </div>
    );
}

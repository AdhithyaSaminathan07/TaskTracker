"use client";

import { Activity, Edit2, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

interface NutritionSummaryProps {
    meals: any[];
}

export function NutritionSummary({ meals }: NutritionSummaryProps) {
    const [target, setTarget] = useState(2000);
    const [isEditing, setIsEditing] = useState(false);
    const [newTarget, setNewTarget] = useState("");
    const [loading, setLoading] = useState(true);

    const total = meals.reduce(
        (acc, meal) => ({
            calories: acc.calories + (meal.calories || 0),
            protein: acc.protein + (meal.protein || 0),
            carbs: acc.carbs + (meal.carbs || 0),
            fats: acc.fats + (meal.fats || 0),
            fiber: acc.fiber + (meal.fiber || 0),
        }),
        { calories: 0, protein: 0, carbs: 0, fats: 0, fiber: 0 }
    );

    useEffect(() => {
        fetchTarget();
    }, []);

    async function fetchTarget() {
        try {
            const userData = JSON.parse(localStorage.getItem("user_data") || "{}");
            const res = await fetch("/api/user/target", {
                headers: { "x-user-id": userData.id || userData._id }
            });
            const data = await res.json();
            if (data.success) {
                setTarget(data.target);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    async function handleUpdateTarget() {
        try {
            const userData = JSON.parse(localStorage.getItem("user_data") || "{}");
            const res = await fetch("/api/user/target", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "x-user-id": userData.id || userData._id
                },
                body: JSON.stringify({ target: Number(newTarget) })
            });
            if (res.ok) {
                setTarget(Number(newTarget));
                setIsEditing(false);
            }
        } catch (e) {
            console.error(e);
        }
    }

    const percentage = Math.min(100, (total.calories / target) * 100);

    return (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="col-span-2 rounded-2xl bg-zinc-900 p-5 text-white dark:bg-zinc-800">
                <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 opacity-80">
                        <Activity className="h-5 w-5" />
                        <span className="text-xs font-bold uppercase tracking-wider">Daily Goal</span>
                    </div>
                    <button
                        onClick={() => {
                            setNewTarget(target.toString());
                            setIsEditing(true);
                        }}
                        className="rounded-full bg-white/10 p-1.5 hover:bg-white/20 transition-colors"
                    >
                        <Edit2 className="h-3 w-3" />
                    </button>
                </div>

                {isEditing ? (
                    <div className="mb-2 flex items-center gap-2">
                        <input
                            type="number"
                            value={newTarget}
                            onChange={(e) => setNewTarget(e.target.value)}
                            className="w-24 rounded-lg bg-white/10 px-2 py-1 text-lg font-bold outline-none border border-white/20 focus:border-purple-500"
                            autoFocus
                        />
                        <button
                            onClick={handleUpdateTarget}
                            className="text-xs font-semibold bg-purple-600 px-3 py-1.5 rounded-lg hover:bg-purple-500"
                        >
                            Save
                        </button>
                    </div>
                ) : (
                    <div className="mb-2 flex items-baseline gap-1">
                        <span className="text-3xl font-bold">{total.calories}</span>
                        <span className="text-sm opacity-60">/ {target} kcal</span>
                    </div>
                )}

                {/* Progress Bar */}
                <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                    <div
                        className="h-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                    />
                </div>
                <div className="mt-2 text-right text-xs opacity-60">
                    {Math.round(percentage)}% of daily goal
                </div>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
                <div className="text-xs font-semibold text-blue-600 dark:text-blue-400">Protein</div>
                <div className="mt-1 text-2xl font-bold text-zinc-900 dark:text-white">
                    {total.protein.toFixed(1)}<span className="text-sm font-normal text-zinc-500">g</span>
                </div>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
                <div className="text-xs font-semibold text-green-600 dark:text-green-400">Carbs</div>
                <div className="mt-1 text-2xl font-bold text-zinc-900 dark:text-white">
                    {total.carbs.toFixed(1)}<span className="text-sm font-normal text-zinc-500">g</span>
                </div>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
                <div className="text-xs font-semibold text-yellow-600 dark:text-yellow-400">Fats</div>
                <div className="mt-1 text-2xl font-bold text-zinc-900 dark:text-white">
                    {total.fats.toFixed(1)}<span className="text-sm font-normal text-zinc-500">g</span>
                </div>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
                <div className="text-xs font-semibold text-purple-600 dark:text-purple-400">Fiber</div>
                <div className="mt-1 text-2xl font-bold text-zinc-900 dark:text-white">
                    {total.fiber.toFixed(1)}<span className="text-sm font-normal text-zinc-500">g</span>
                </div>
            </div>
        </div>
    );
}

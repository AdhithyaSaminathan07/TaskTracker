"use client";

import { Clock, Trash2 } from "lucide-react";

interface Meal {
    _id: string;
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    type: string;
    date: string;
}

interface MealListProps {
    meals: Meal[];
}

export function MealList({ meals }: MealListProps) {
    if (meals.length === 0) {
        return (
            <div className="flex h-32 flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-200 bg-zinc-50/50 text-center dark:border-zinc-800 dark:bg-zinc-900/50">
                <p className="text-sm font-medium text-zinc-900 dark:text-white">No meals tracked today</p>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Add a meal to start tracking</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {meals.map((meal) => (
                <div
                    key={meal._id}
                    className="group relative flex items-center justify-between rounded-2xl border border-zinc-200 bg-white p-4 transition-all hover:border-purple-200 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-purple-900/50"
                >
                    <div className="flex gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-xl dark:bg-zinc-800">
                            {/* Simple icon logic based on type */}
                            {meal.type === 'Breakfast' ? '🍳' :
                                meal.type === 'Lunch' ? '🥗' :
                                    meal.type === 'Dinner' ? '🍽️' : '🍎'}
                        </div>
                        <div>
                            <h4 className="font-semibold text-zinc-900 dark:text-white">{meal.name}</h4>
                            <div className="mt-1 flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
                                <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {meal.type}
                                </span>
                                <span>•</span>
                                <span className="font-medium text-orange-600 dark:text-orange-400">
                                    {meal.calories} kcal
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs">
                        <div className="hidden text-right sm:block">
                            <div className="text-zinc-400">Macros</div>
                            <div className="font-medium text-zinc-900 dark:text-zinc-300">
                                <span className="text-blue-600 dark:text-blue-400">{meal.protein}p</span> /{" "}
                                <span className="text-green-600 dark:text-green-400">{meal.carbs}c</span> /{" "}
                                <span className="text-yellow-600 dark:text-yellow-400">{meal.fats}f</span>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

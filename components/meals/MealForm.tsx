"use client";

import { useState } from "react";
import { Loader2, Plus, Utensils, Wand2 } from "lucide-react";

interface MealFormProps {
    onMealAdded: () => void;
}

export function MealForm({ onMealAdded }: MealFormProps) {
    const [loading, setLoading] = useState(false);
    const [analyzing, setAnalyzing] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    // Form States
    const [name, setName] = useState("");
    const [calories, setCalories] = useState("");
    const [protein, setProtein] = useState("");
    const [carbs, setCarbs] = useState("");
    const [fats, setFats] = useState("");
    const [fiber, setFiber] = useState("");
    const [type, setType] = useState("Snack");

    // Autocomplete Data
    const FOOD_SUGGESTIONS = [
        "Apple", "Banana", "Rice", "Chicken", "Egg", "Milk", "Oats", "Bread",
        "Idli", "Dosa", "Masala Dosa", "Sambar", "Vada", "Upma", "Pongal", "Kesari", "Uttapam", "Pesarattu",
        "Chapati", "Parotta", "Curd Rice", "Rasam", "Veg Biryani", "Chicken Biryani",
        "Chicken 65", "Fish Curry", "Chettinad Chicken", "Mutton Sukka", "Pepper Chicken",
        "Egg Curry", "Prawn Fry", "Omelette", "Karuvadu",
        "Jackfruit", "Mango", "Guava", "Papaya", "Pomegranate", "Sapota", "Tender Coconut",
        "Murukku", "Athirasam", "Paniyaram", "Sundal", "Bajji", "Bonda", "Masala Vada", "Mixture", "Thattai", "Seedai",
        "Pani Puri", "Masal Puri", "Bhel Puri", "Sev Puri", "Dahi Puri", "Samosa", "Pav Bhaji", "Cutlet",
        "Lemon Rice", "Tamarind Rice", "Tomato Rice"
    ];

    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
        const value = e.target.value;
        setName(value);

        if (value.length > 0) {
            const filtered = FOOD_SUGGESTIONS.filter(food =>
                food.toLowerCase().includes(value.toLowerCase())
            );
            setSuggestions(filtered);
            setShowSuggestions(true);
        } else {
            setShowSuggestions(false);
        }
    }

    function selectSuggestion(suggestion: string) {
        setName(suggestion);
        setShowSuggestions(false);
    }

    async function handleAnalyze() {
        if (!name) return;
        setAnalyzing(true);
        try {
            const res = await fetch(`/api/meals/analyze?query=${encodeURIComponent(name)}`);
            const data = await res.json();

            if (data.success && data.data) {
                setCalories(data.data.calories.toFixed(0));
                setProtein(data.data.protein.toFixed(1));
                setCarbs(data.data.carbs.toFixed(1));
                setFats(data.data.fats.toFixed(1));
                setFiber(data.data.fiber.toFixed(1));
            } else {
                alert(data.message || "Food not found");
            }
        } catch (e) {
            console.error(e);
        } finally {
            setAnalyzing(false);
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        const data = {
            name,
            calories: Number(calories),
            protein: Number(protein),
            carbs: Number(carbs),
            fats: Number(fats),
            fiber: Number(fiber),
            type,
        };

        const userData = JSON.parse(localStorage.getItem("user_data") || "{}");

        try {
            const res = await fetch("/api/meals", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-user-id": userData.id || userData._id,
                },
                body: JSON.stringify(data),
            });

            if (res.ok) {
                setIsOpen(false);
                onMealAdded();
                // Reset
                setName("");
                setCalories("");
                setProtein("");
                setCarbs("");
                setFats("");
                setFiber("");
                setSuggestions([]);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-zinc-200 bg-zinc-50/50 py-4 text-sm font-semibold text-zinc-500 transition-all hover:border-purple-300 hover:bg-purple-50 hover:text-purple-600 dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:border-purple-700 dark:hover:bg-purple-900/10"
            >
                <Plus className="h-5 w-5" />
                Add Meal
            </button>
        );
    }

    return (
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="mb-6 flex items-center justify-between">
                <h3 className="flex items-center gap-2 font-semibold text-zinc-900 dark:text-white">
                    <Utensils className="h-5 w-5 text-purple-600" />
                    Add New Meal
                </h3>
                <button
                    onClick={() => setIsOpen(false)}
                    className="text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                >
                    Cancel
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                        <label className="mb-1.5 block text-xs font-medium text-zinc-500 dark:text-zinc-400">
                            Meal Name (e.g. &quot;2 eggs and toast&quot;)
                        </label>
                        <div className="relative">
                            <input
                                value={name}
                                onChange={handleNameChange}
                                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                                onFocus={() => name && setShowSuggestions(true)}
                                required
                                placeholder="What did you eat?"
                                className="w-full rounded-xl border border-zinc-200 bg-white pl-3 pr-12 py-2 text-sm outline-none transition-all focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 dark:border-zinc-800 dark:bg-zinc-950"
                            />
                            <button
                                type="button"
                                onClick={handleAnalyze}
                                disabled={analyzing || !name}
                                className="absolute right-1.5 top-1.5 rounded-lg bg-purple-100 p-1 text-purple-600 transition-colors hover:bg-purple-200 disabled:opacity-50 dark:bg-purple-900/30 dark:text-purple-400"
                                title="Auto-calculate nutrition"
                            >
                                {analyzing ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Wand2 className="h-4 w-4" />
                                )}
                            </button>

                            {/* Suggestions Dropdown */}
                            {showSuggestions && suggestions.length > 0 && (
                                <ul className="absolute z-10 mt-1 max-h-40 w-full overflow-y-auto rounded-xl border border-zinc-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
                                    {suggestions.map((suggestion, index) => (
                                        <li
                                            key={index}
                                            onMouseDown={() => selectSuggestion(suggestion)}
                                            className="cursor-pointer px-4 py-2 text-sm text-zinc-700 hover:bg-purple-50 hover:text-purple-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
                                        >
                                            {suggestion}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        <p className="mt-1 text-[10px] text-zinc-400">
                            Click the wand to auto-fill nutrition info.
                        </p>
                    </div>

                    <div>
                        <label className="mb-1.5 block text-xs font-medium text-zinc-500 dark:text-zinc-400">
                            Type
                        </label>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none transition-all focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 dark:border-zinc-800 dark:bg-zinc-950"
                        >
                            <option value="Breakfast">Breakfast</option>
                            <option value="Lunch">Lunch</option>
                            <option value="Dinner">Dinner</option>
                            <option value="Snack">Snack</option>
                        </select>
                    </div>

                    <div>
                        <label className="mb-1.5 block text-xs font-medium text-zinc-500 dark:text-zinc-400">
                            Calories (kcal)
                        </label>
                        <input
                            value={calories}
                            onChange={(e) => setCalories(e.target.value)}
                            type="number"
                            required
                            className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none transition-all focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 dark:border-zinc-800 dark:bg-zinc-950"
                        />
                    </div>

                    <div>
                        <label className="mb-1.5 block text-xs font-medium text-zinc-500 dark:text-zinc-400">
                            Protein (g)
                        </label>
                        <input
                            value={protein}
                            onChange={(e) => setProtein(e.target.value)}
                            type="number"
                            step="0.1"
                            className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none transition-all focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 dark:border-zinc-800 dark:bg-zinc-950"
                        />
                    </div>

                    <div>
                        <label className="mb-1.5 block text-xs font-medium text-zinc-500 dark:text-zinc-400">
                            Carbs (g)
                        </label>
                        <input
                            value={carbs}
                            onChange={(e) => setCarbs(e.target.value)}
                            type="number"
                            step="0.1"
                            className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none transition-all focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 dark:border-zinc-800 dark:bg-zinc-950"
                        />
                    </div>

                    <div>
                        <label className="mb-1.5 block text-xs font-medium text-zinc-500 dark:text-zinc-400">
                            Fats (g)
                        </label>
                        <input
                            value={fats}
                            onChange={(e) => setFats(e.target.value)}
                            type="number"
                            step="0.1"
                            className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none transition-all focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 dark:border-zinc-800 dark:bg-zinc-950"
                        />
                    </div>

                    <div>
                        <label className="mb-1.5 block text-xs font-medium text-zinc-500 dark:text-zinc-400">
                            Fiber (g)
                        </label>
                        <input
                            value={fiber}
                            onChange={(e) => setFiber(e.target.value)}
                            type="number"
                            step="0.1"
                            className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none transition-all focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 dark:border-zinc-800 dark:bg-zinc-950"
                        />
                    </div>
                </div>

                <div className="flex justify-end pt-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center rounded-xl bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition-all hover:bg-purple-500 hover:shadow-lg disabled:opacity-50"
                    >
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Meal
                    </button>
                </div>
            </form>
        </div>
    );
}

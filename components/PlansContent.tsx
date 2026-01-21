"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, Loader2 } from "lucide-react";

interface PlanGoal {
    id: string;
    title: string;
    isCompleted: boolean;
}

export function PlansContent() {
    const [input, setInput] = useState("");
    const [goals, setGoals] = useState<PlanGoal[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const router = useRouter();
    const getHeaders = () => {
        const userData = JSON.parse(localStorage.getItem("user_data") || "{}");
        return {
            "Content-Type": "application/json",
            "x-user-email": userData.email || "",
            "x-user-id": userData.id || userData._id || ""
        };
    };

    useEffect(() => {
        async function fetchPlan() {
            try {
                const res = await fetch("/api/plans", { headers: getHeaders() });
                const data = await res.json();
                if (data.success && data.data && data.data.goals) {
                    setGoals(data.data.goals);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchPlan();
    }, []);

    // Scroll to bottom on added
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [goals]);

    const addGoal = () => {
        if (!input.trim()) return;

        const newGoal = {
            id: crypto.randomUUID(),
            title: input.trim(),
            isCompleted: false
        };

        setGoals([...goals, newGoal]);
        setInput("");
    };

    const removeGoal = (id: string) => {
        setGoals(goals.filter(g => g.id !== id));
    };

    async function handleSave() {
        setSaving(true);
        try {
            await fetch("/api/plans", {
                method: "PUT",
                headers: getHeaders(),
                body: JSON.stringify({
                    goals: goals
                }),
            });
            router.push("/dashboard/focus");
            router.refresh();
        } catch (err) { console.error(err); } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-white dark:bg-zinc-950">
                <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
            </div>
        );
    }

    return (
        <div className="flex min-h-screen flex-col bg-white transition-colors dark:bg-zinc-950">
            {/* Minimal Header */}
            <div className="mx-auto flex w-full max-w-2xl flex-col px-6 pb-24 pt-10">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Weekly Focus</h1>
                    <button onClick={handleSave} className="rounded-xl bg-zinc-900 px-4 py-2 font-bold text-white transition-all hover:bg-zinc-800 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-zinc-200">
                        {saving ? "Saving..." : "Save"}
                    </button>
                </div>
                <p className="mt-2 text-sm text-zinc-500">Set your goals for the week.</p>

                <div className="mt-8 flex flex-col gap-4" ref={scrollRef}>
                    {goals.map((goal) => (
                        <div key={goal.id} className="flex items-center gap-4">
                            <input
                                type="checkbox"
                                checked={goal.isCompleted}
                                onChange={() => {
                                    const updatedGoals = goals.map(g => g.id === goal.id ? { ...g, isCompleted: !g.isCompleted } : g);
                                    setGoals(updatedGoals);
                                }}
                                className="h-5 w-5 rounded border-zinc-300 text-purple-600 focus:ring-purple-500"
                            />
                            <input
                                type="text"
                                value={goal.title}
                                onChange={(e) => {
                                    const updatedGoals = goals.map(g => g.id === goal.id ? { ...g, title: e.target.value } : g);
                                    setGoals(updatedGoals);
                                }}
                                className="flex-1 rounded-lg border-none bg-transparent text-lg font-medium text-zinc-700 focus:outline-none focus:ring-0 dark:text-white"
                            />
                            <button onClick={() => removeGoal(goal.id)} className="rounded-full p-2 text-zinc-400 transition-all hover:bg-zinc-100 hover:text-red-500 dark:hover:bg-zinc-800">
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    ))}
                </div>

                <div className="mt-8 flex items-center gap-4">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Add new goal..."
                        className="flex-1 rounded-lg border-none bg-transparent text-lg font-medium focus:outline-none focus:ring-0 dark:text-white"
                        onKeyDown={(e) => e.key === "Enter" && addGoal()}
                    />
                    <button onClick={addGoal} className="rounded-xl bg-zinc-900 px-4 py-2 font-bold text-white transition-all hover:bg-zinc-800 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-zinc-200">
                        Add
                    </button>
                </div>
            </div>
        </div>
    );
}

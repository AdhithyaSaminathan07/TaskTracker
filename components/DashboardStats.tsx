"use client";

import { useEffect, useState } from "react";
import { Loader2, TrendingUp, Flame, Calendar, Target, IndianRupee, CheckCircle2, Clock } from "lucide-react";
import { WeeklyTracker } from "@/components/WeeklyTracker";
import Link from "next/link";

const COLORS = [
    { name: "Pink", value: "bg-pink-100 text-pink-900 border-pink-200 dark:bg-pink-900/30 dark:text-pink-100 dark:border-pink-800", dot: "bg-pink-500" },
    { name: "Purple", value: "bg-purple-100 text-purple-900 border-purple-200 dark:bg-purple-900/30 dark:text-purple-100 dark:border-purple-800", dot: "bg-purple-500" },
    { name: "Yellow", value: "bg-yellow-100 text-yellow-900 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-100 dark:border-yellow-800", dot: "bg-yellow-500" },
    { name: "Green", value: "bg-emerald-100 text-emerald-900 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-100 dark:border-emerald-800", dot: "bg-emerald-500" },
    { name: "Blue", value: "bg-blue-100 text-blue-900 border-blue-200 dark:bg-blue-900/30 dark:text-blue-100 dark:border-blue-800", dot: "bg-blue-500" },
];

interface PlanGoal {
    id: string;
    title: string;
    description?: string;
    startTime?: string;
    date?: string;
    color?: string;
    isCompleted: boolean;
}

export function DashboardStats() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ streak: 0, consistency: 0, completedCount: 0 });
    const [userName, setUserName] = useState("User");
    const [todayExpenses, setTodayExpenses] = useState(0);
    const [weeklyPlans, setWeeklyPlans] = useState<PlanGoal[]>([]);

    const getHeaders = () => {
        const userData = JSON.parse(localStorage.getItem("user_data") || "{}");
        return {
            "Content-Type": "application/json",
            "x-user-email": userData.email || "",
            "x-user-id": userData.id || userData._id || ""
        };
    };

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem("user_data") || "{}");
        if (userData.name) setUserName(userData.name);

        async function fetchStats() {
            const userData = JSON.parse(localStorage.getItem("user_data") || "{}");
            if (!userData.id && !userData._id) {
                setLoading(false);
                return;
            }
            try {
                const [focusRes, expenseRes, plansRes] = await Promise.all([
                    fetch("/api/focus/week", { headers: getHeaders() }),
                    fetch("/api/expenses/stats", { headers: getHeaders() }),
                    fetch("/api/plans", { headers: getHeaders() })
                ]);

                const focusData = await focusRes.json();
                if (focusData.success) {
                    calculateStats(focusData.data);
                }

                if (expenseRes.ok) {
                    const expenseData = await expenseRes.json();
                    setTodayExpenses(expenseData.today || 0);
                }

                if (plansRes.ok) {
                    const plansData = await plansRes.json();
                    if (plansData.success && plansData.data) {
                        // Handle both direct goals array and nested goals
                        const goals = plansData.data.goals || [];
                        setWeeklyPlans(goals);
                    }
                } else {
                    console.error("Failed to fetch plans:", plansRes.status);
                }
            } catch (err) {
                console.error("Failed to fetch dashboard stats", err);
            } finally {
                setLoading(false);
            }
        }
        fetchStats();
    }, []);

    function calculateStats(last7Days: { date: string; isCompleted: boolean }[]) {
        // 1. Consistency: % of days with isCompleted
        const completed = last7Days.filter(d => d.isCompleted).length;
        const consistency = Math.round((completed / 7) * 100);

        // 2. Streak: Count backwards from today
        let currentStreak = 0;
        // Sort by date descending (newest first)
        const sorted = [...last7Days].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        for (const day of sorted) {
            if (day.isCompleted) {
                currentStreak++;
            } else {
                // Allow today to be incomplete if it's currently happening, but break if yesterday was missed
                const isToday = new Date(day.date).toDateString() === new Date().toDateString();
                if (!isToday) break;
            }
        }

        setStats({ streak: currentStreak, consistency, completedCount: completed });
    }

    if (loading) {
        return (
            <div className="flex justify-center p-8">
                <Loader2 className="h-6 w-6 animate-spin text-purple-600" />
            </div>
        );
    }

    // Filter for TODAY's plans
    const todayStr = new Date().toLocaleDateString('en-CA');
    const todaysPlans = weeklyPlans.filter(p => p.date === todayStr).sort((a, b) => (a.startTime || "").localeCompare(b.startTime || ""));

    return (
        <div className="space-y-6">
            {/* Today Expenses Summary (Top section) */}
            <div className="rounded-2xl border border-emerald-300 bg-emerald-100 p-4 flex items-center justify-between dark:border-emerald-500/60 dark:bg-emerald-900/40">
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                        <IndianRupee className="h-5 w-5" />
                    </div>
                    <div>
                        <div className="text-sm font-extrabold uppercase tracking-wide text-emerald-900 dark:text-emerald-100">
                            Today&apos;s Expenses
                        </div>
                        <div className="text-xs font-semibold text-emerald-900/90 dark:text-emerald-100/80">
                            Total you&apos;ve spent so far today.
                        </div>
                    </div>
                </div>
                <div className="text-2xl font-extrabold text-emerald-950 dark:text-emerald-50">
                    ₹{todayExpenses.toFixed(0)}
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
                {/* Streak Card */}
                <div className="rounded-2xl border border-orange-100 bg-orange-50/50 p-4 dark:border-orange-900/30 dark:bg-orange-900/10">
                    <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
                        <Flame className="h-5 w-5" fill="currentColor" />
                    </div>
                    <div className="text-2xl font-bold text-zinc-900 dark:text-white">
                        {stats.streak} <span className="text-sm font-medium text-zinc-500">days</span>
                    </div>
                    <div className="text-xs font-medium text-orange-600 dark:text-orange-400">
                        Current Streak
                    </div>
                </div>

                {/* Consistency Card */}
                <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4 dark:border-blue-900/30 dark:bg-blue-900/10">
                    <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                        <TrendingUp className="h-5 w-5" />
                    </div>
                    <div className="text-2xl font-bold text-zinc-900 dark:text-white">
                        {stats.consistency}%
                    </div>
                    <div className="text-xs font-medium text-blue-600 dark:text-blue-400">
                        Weekly Consistency
                    </div>
                </div>
            </div>

            {/* Today's Plans Summary (Grid) */}
            <div className="rounded-2xl border border-purple-200 bg-white p-5 shadow-sm dark:border-purple-800/50 dark:bg-zinc-900">
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="flex items-center gap-2 font-semibold text-zinc-900 dark:text-white">
                        <Target className="h-4 w-4 text-purple-500" />
                        Today&apos;s Plans
                    </h3>
                    <Link
                        href="/dashboard/plans"
                        className="text-xs font-medium text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
                    >
                        {todaysPlans.length > 0 ? 'View All →' : 'Add Plans →'}
                    </Link>
                </div>

                {todaysPlans.length > 0 ? (
                    <div className="max-h-80 overflow-y-auto pr-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-zinc-200 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full dark:[&::-webkit-scrollbar-thumb]:bg-zinc-800">
                        <div className="grid grid-cols-2 gap-3 pb-2">
                            {todaysPlans.map((plan) => {
                                const statusColor = plan.isCompleted
                                    ? "bg-emerald-100 border-emerald-200 text-emerald-900 dark:bg-emerald-900/20 dark:text-emerald-100 dark:border-emerald-800"
                                    : "bg-orange-50 border-orange-200 text-orange-900 dark:bg-orange-900/20 dark:text-orange-100 dark:border-orange-800";

                                return (
                                    <div
                                        key={plan.id}
                                        className={`relative rounded-xl p-3 transition-all border ${statusColor} ${plan.isCompleted ? 'opacity-90' : ''}`}
                                    >
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-start justify-between gap-2">
                                                <h4 className={`font-bold text-sm leading-tight line-clamp-1 ${plan.isCompleted ? 'line-through decoration-current/40' : ''}`}>
                                                    {plan.title}
                                                </h4>
                                                {plan.isCompleted && <CheckCircle2 className="h-4 w-4 shrink-0" />}
                                                {!plan.isCompleted && <Clock className="h-4 w-4 shrink-0 opacity-50" />}
                                            </div>

                                            <div className="flex items-center justify-between text-xs opacity-80 mt-1">
                                                <span className="font-semibold">{plan.startTime || "Today"}</span>
                                            </div>

                                            {plan.description && (
                                                <p className="text-xs opacity-70 line-clamp-1 mt-1">
                                                    {plan.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <div className="py-4 text-center">
                        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-2">
                            No plans set for today
                        </p>
                        <Link
                            href="/dashboard/plans"
                            className="inline-block text-xs font-medium text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
                        >
                            Set your daily goals →
                        </Link>
                    </div>
                )}
            </div>

            {/* Weekly Tracker (Reuse existing component) */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="flex items-center gap-2 font-semibold text-zinc-900 dark:text-white">
                        <Calendar className="h-4 w-4 text-purple-500" />
                        Last 7 Days
                    </h3>
                    <span className="text-xs text-zinc-400">
                        {stats.completedCount}/7 Done
                    </span>
                </div>
                <WeeklyTracker refreshTrigger={0} />
            </div>


        </div>
    );
}

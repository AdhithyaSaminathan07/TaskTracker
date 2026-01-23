"use client";

import { useEffect, useState } from "react";
import { Loader2, TrendingUp, Flame, Calendar, Target, IndianRupee, CheckCircle2 } from "lucide-react";
import { WeeklyTracker } from "@/components/WeeklyTracker";
import Link from "next/link";

interface PlanGoal {
    id: string;
    title: string;
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
        // Note: The API returns last 7 days. Ideally streak needs more history, 
        // but let's approximate with what we have or just count consecutive in the week window for now.
        // For a real app, we need a dedicated stats endpoint.
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

            {/* Weekly Plans Summary */}
            <div className="rounded-2xl border border-purple-200 bg-white p-5 shadow-sm dark:border-purple-800/50 dark:bg-zinc-900">
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="flex items-center gap-2 font-semibold text-zinc-900 dark:text-white">
                        <Target className="h-4 w-4 text-purple-500" />
                        Weekly Plans
                    </h3>
                    <Link 
                        href="/dashboard/plans" 
                        className="text-xs font-medium text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
                    >
                        {weeklyPlans.length > 0 ? 'View All →' : 'Add Plans →'}
                    </Link>
                </div>
                {weeklyPlans.length > 0 ? (
                    <>
                        <div className="space-y-2">
                            {weeklyPlans.slice(0, 3).map((plan) => (
                                <div 
                                    key={plan.id} 
                                    className="flex items-center gap-3 rounded-lg bg-purple-50/50 p-3 dark:bg-purple-900/20"
                                >
                                    <div className={`shrink-0 ${plan.isCompleted ? 'text-purple-600 dark:text-purple-400' : 'text-zinc-400 dark:text-zinc-600'}`}>
                                        <CheckCircle2 className={`h-5 w-5 ${plan.isCompleted ? 'fill-current' : ''}`} />
                                    </div>
                                    <span className={`flex-1 text-sm font-medium ${plan.isCompleted ? 'line-through text-zinc-500 dark:text-zinc-400' : 'text-zinc-900 dark:text-white'}`}>
                                        {plan.title}
                                    </span>
                                </div>
                            ))}
                            {weeklyPlans.length > 3 && (
                                <div className="text-center text-xs text-zinc-500 dark:text-zinc-400 pt-1">
                                    +{weeklyPlans.length - 3} more plan{weeklyPlans.length - 3 !== 1 ? 's' : ''}
                                </div>
                            )}
                        </div>
                        <div className="mt-4 pt-4 border-t border-purple-100 dark:border-purple-800/50">
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-zinc-600 dark:text-zinc-400">
                                    Progress
                                </span>
                                <span className="font-semibold text-purple-600 dark:text-purple-400">
                                    {weeklyPlans.filter(p => p.isCompleted).length}/{weeklyPlans.length} completed
                                </span>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="py-4 text-center">
                        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-2">
                            No plans set for this week
                        </p>
                        <Link 
                            href="/dashboard/plans"
                            className="inline-block text-xs font-medium text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
                        >
                            Set your weekly goals →
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

            {/* Motivation / Prompt */}
            <div className="rounded-2xl bg-linear-to-r from-purple-600 to-indigo-600 p-6 text-white shadow-lg">
                <div className="mb-2 flex items-center gap-2 opacity-80">
                    <Target className="h-5 w-5" />
                    <span className="text-xs font-bold uppercase tracking-wider">Focus Mode</span>
                </div>
                <h3 className="mb-4 text-lg font-semibold leading-relaxed">
                    &quot;Success is the sum of small efforts, repeated day in and day out.&quot;
                </h3>
                {/* Visual indicator to click the center button */}
                <div className="flex items-center gap-2 text-sm text-purple-100 opacity-90">
                    <span>Tap the</span>
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-purple-600">
                        <div className="h-2 w-2 rounded-full bg-current" />
                    </div>
                    <span>button below to start today&apos;s task.</span>
                </div>
            </div>
        </div>
    );
}

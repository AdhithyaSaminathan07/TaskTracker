"use client";

import { useState, useRef, useEffect } from "react";
import { Plus, X, Loader2, ChevronLeft, Calendar as CalendarIcon, Clock, AlignLeft, CheckCircle2, Circle } from "lucide-react";
import { useRouter } from "next/navigation";

interface PlanGoal {
    id: string;
    title: string;
    description?: string;
    startTime?: string;
    endTime?: string;
    date?: string; // YYYY-MM-DD
    color?: string;
    category?: string;
    isCompleted: boolean;
}



export function PlansContent() {
    const router = useRouter();
    const [goals, setGoals] = useState<PlanGoal[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [showModal, setShowModal] = useState(false);

    // Form state
    const [newTitle, setNewTitle] = useState("");
    const [newTime, setNewTime] = useState("");

    const dateStripRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (dateStripRef.current) {
            const selectedButton = dateStripRef.current.querySelector('[data-selected="true"]');
            if (selectedButton) {
                selectedButton.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            }
        }
    }, [selectedDate]);

    const getHeaders = () => {
        const userData = JSON.parse(localStorage.getItem("user_data") || "{}");
        return {
            "Content-Type": "application/json",
            "x-user-email": userData.email || "",
            "x-user-id": userData.id || userData._id || ""
        };
    };

    const fetchPlan = async () => {
        const userData = JSON.parse(localStorage.getItem("user_data") || "{}");
        if (!userData.id && !userData._id) {
            setLoading(false);
            return;
        }
        try {
            const res = await fetch("/api/plans", { headers: getHeaders() });
            const data = await res.json();
            if (data.success && data.data) {
                if (data.data.goals) setGoals(data.data.goals);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlan();
    }, []);

    const saveGoal = async () => {
        if (!newTitle.trim()) return;

        const userData = JSON.parse(localStorage.getItem("user_data") || "{}");
        // We need to persist this changes to backend
        // For now, we update local state and call PUT /api/plans

        const newGoal: PlanGoal = {
            id: crypto.randomUUID(),
            title: newTitle,
            startTime: newTime,
            date: selectedDate.toLocaleDateString('en-CA'),
            color: "bg-purple-100 text-purple-900 border-purple-200 dark:bg-purple-900/30 dark:text-purple-100 dark:border-purple-800", // Default Purple
            isCompleted: false
        };

        const updatedGoals = [...goals, newGoal];
        setGoals(updatedGoals);
        setShowModal(false);
        resetForm();

        // Save to DB
        try {
            await fetch("/api/plans", {
                method: "PUT",
                headers: getHeaders(),
                body: JSON.stringify({ goals: updatedGoals })
            });
        } catch (error) {
            console.error("Failed to save plan", error);
        }
    };

    const deleteGoal = async (id: string) => {
        const updatedGoals = goals.filter(g => g.id !== id);
        setGoals(updatedGoals);
        try {
            await fetch("/api/plans", {
                method: "PUT",
                headers: getHeaders(),
                body: JSON.stringify({ goals: updatedGoals })
            });
        } catch (error) {
            console.error("Failed to save plan", error);
        }
    };

    const toggleGoal = async (id: string) => {
        const updatedGoals = goals.map(g => g.id === id ? { ...g, isCompleted: !g.isCompleted } : g);
        setGoals(updatedGoals);
        try {
            await fetch("/api/plans", {
                method: "PUT",
                headers: getHeaders(),
                body: JSON.stringify({ goals: updatedGoals })
            });
        } catch (error) {
            console.error("Failed to save plan", error);
        }
    };

    const resetForm = () => {
        setNewTitle("");
        setNewTime("");
        setShowModal(false);
    };

    // Calendar Generation
    const getWeekDays = () => {
        const days = [];
        const today = new Date();
        for (let i = 0; i < 7; i++) {
            const nextDay = new Date(today);
            nextDay.setDate(today.getDate() + i);
            days.push(nextDay);
        }
        return days;
    };

    const weekDays = getWeekDays();

    // Filter goals for selected date
    const dailyGoals = goals.filter(g => {
        if (!g.date) return false;
        return g.date === selectedDate.toLocaleDateString('en-CA');
    }).sort((a, b) => (a.startTime || "").localeCompare(b.startTime || ""));


    if (loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-zinc-50 dark:bg-zinc-950">
                <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
            </div>
        );
    }

    return (
        <div className="flex min-h-screen flex-col bg-[#fafafa] text-zinc-900 transition-colors dark:bg-[#09090b] dark:text-zinc-50 relative font-sans">

            {/* Header Area */}
            <div className="sticky top-0 z-40 bg-[#fafafa]/80 py-2 backdrop-blur-xl border-b border-zinc-200/50 dark:bg-[#09090b]/80 dark:border-zinc-800/50">
                <div className="mx-auto max-w-2xl px-4">
                    <div className="flex items-center gap-4 py-2">
                        <button onClick={() => router.back()} className="shrink-0 rounded-full bg-white/50 p-2.5 text-zinc-500 hover:bg-white hover:text-zinc-900 hover:shadow-sm transition-all active:scale-95 dark:bg-zinc-800/50 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100">
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                        <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">Schedule</h1>
                        <div className="flex-1" />

                        <button
                            onClick={() => setShowModal(true)}
                            className="group relative flex items-center gap-2 rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-zinc-900/20 transition-all hover:bg-zinc-800 hover:scale-[1.02] active:scale-95 dark:bg-white dark:text-zinc-900 dark:shadow-white/20 dark:hover:bg-zinc-100"
                        >
                            <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />
                            <span>Add Task</span>
                        </button>
                    </div>

                    {/* Premium Date Strip */}
                    <div
                        ref={dateStripRef}
                        className="flex items-center gap-2 overflow-x-auto py-4 scrollbar-hide mask-fade-sides"
                        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                    >
                        {weekDays.map((date, i) => {
                            const isSelected = date.toLocaleDateString('en-CA') === selectedDate.toLocaleDateString('en-CA');
                            const isToday = date.toLocaleDateString('en-CA') === new Date().toLocaleDateString('en-CA');

                            return (
                                <button
                                    key={i}
                                    onClick={() => setSelectedDate(date)}
                                    data-selected={isSelected}
                                    className={`relative flex min-w-[4rem] flex-col items-center justify-center gap-1 rounded-2xl py-3 transition-all duration-300 ${isSelected
                                        ? "bg-zinc-900 text-white shadow-lg shadow-zinc-900/25 scale-105 z-10 dark:bg-white dark:text-zinc-900 dark:shadow-white/20"
                                        : "bg-white text-zinc-400 hover:bg-zinc-100/80 hover:scale-105 active:scale-95 dark:bg-zinc-900 dark:text-zinc-500 dark:hover:bg-zinc-800"
                                        }`}
                                >
                                    <span className="text-[11px] font-bold uppercase tracking-wider opacity-60">{date.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                                    <span className="text-xl font-bold tracking-tight">
                                        {date.getDate()}
                                    </span>
                                    {isToday && !isSelected && (
                                        <div className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-indigo-500" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Task List */}
            <div className="mx-auto w-full max-w-2xl flex-1 px-4 pb-32 pt-6">
                <div className="space-y-4">
                    {dailyGoals.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center opacity-0 animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-forwards">
                            <div className="mb-4 rounded-full bg-zinc-100 p-6 dark:bg-zinc-900">
                                <CalendarIcon className="h-10 w-10 text-zinc-300 dark:text-zinc-700" />
                            </div>
                            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">No plans yet</h3>
                            <p className="text-sm text-zinc-500 max-w-xs mx-auto mt-1">
                                Your schedule is clear. Enjoy the free time or add a new task to get started.
                            </p>
                        </div>
                    ) : (
                        dailyGoals.map((goal, idx) => (
                            <div
                                key={goal.id}
                                className="relative group opacity-0 animate-in fade-in slide-in-from-bottom-4 fill-mode-forwards"
                                style={{ animationDelay: `${idx * 50}ms`, animationDuration: '500ms' }}
                            >
                                <div
                                    onClick={() => toggleGoal(goal.id)}
                                    className={`relative flex items-center justify-between gap-4 rounded-3xl border p-5 transition-all duration-300 cursor-pointer overflow-hidden
                                        ${goal.isCompleted
                                            ? 'bg-zinc-50/50 border-zinc-100 opacity-60 dark:bg-zinc-900/30 dark:border-zinc-800/50'
                                            : 'bg-white border-zinc-100 shadow-sm hover:shadow-lg hover:shadow-zinc-200/50 hover:border-zinc-200 hover:-translate-y-0.5 dark:bg-zinc-900 dark:border-zinc-800 dark:hover:bg-zinc-800/80 dark:hover:shadow-black/40'
                                        }`}
                                >
                                    <div className="flex items-center gap-5 flex-1 min-w-0 z-10">
                                        {/* Custom Checkbox */}
                                        <div className={`relative flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300 ${goal.isCompleted
                                            ? 'border-indigo-500 bg-indigo-500 text-white scale-110'
                                            : 'border-zinc-300 text-transparent group-hover:border-indigo-400 dark:border-zinc-600'
                                            }`}>
                                            <CheckCircle2 className={`h-4 w-4 transition-transform duration-300 ${goal.isCompleted ? 'scale-100' : 'scale-0'}`} fill="currentColor" />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <h3 className={`text-base font-semibold tracking-tight truncate transition-all ${goal.isCompleted
                                                ? 'text-zinc-400 line-through decoration-zinc-300'
                                                : 'text-zinc-900 dark:text-zinc-50'
                                                }`}>
                                                {goal.title}
                                            </h3>
                                            {goal.startTime && (
                                                <div className={`mt-1 flex items-center gap-1.5 text-xs font-medium transition-colors ${goal.isCompleted ? 'text-zinc-400' : 'text-zinc-500 group-hover:text-indigo-600 dark:text-zinc-400 dark:group-hover:text-indigo-400'
                                                    }`}>
                                                    <Clock className="h-3 w-3" />
                                                    {goal.startTime}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Delete Action - Only visible on hover/focus */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            deleteGoal(goal.id);
                                        }}
                                        className="relative z-10 -mr-2 rounded-xl p-2 text-zinc-300 transition-all duration-200 hover:bg-red-50 hover:text-red-500 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 dark:hover:bg-red-950/30"
                                        title="Delete task"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Add Task Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl dark:bg-zinc-900 animate-in zoom-in-95 duration-200 relative">
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute right-4 top-4 rounded-full p-2 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        <h2 className="text-lg font-bold mb-4 px-1">Add Task</h2>

                        <div className="space-y-4">
                            <input
                                autoFocus
                                className="w-full rounded-2xl bg-zinc-50 border-0 p-4 font-semibold text-lg focus:ring-2 focus:ring-indigo-500 placeholder:text-zinc-400 dark:bg-zinc-800/50"
                                placeholder="What needs to be done?"
                                value={newTitle}
                                onChange={e => setNewTitle(e.target.value)}
                            />

                            <div className="flex gap-3">
                                <input
                                    className="flex-1 rounded-2xl bg-zinc-50 border-0 p-4 font-medium focus:ring-2 focus:ring-indigo-500 placeholder:text-zinc-400 dark:bg-zinc-800/50"
                                    placeholder="Time (e.g. 2 PM)"
                                    value={newTime}
                                    onChange={e => setNewTime(e.target.value)}
                                />
                                <button
                                    onClick={saveGoal}
                                    disabled={!newTitle.trim()}
                                    className="rounded-2xl bg-indigo-600 px-6 font-bold text-white shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-700 active:scale-95 transition-all"
                                >
                                    Add
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

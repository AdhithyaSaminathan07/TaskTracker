"use client";

import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation"; // Unused
import { Check, Loader2, Sparkles, X, Target, CalendarDays, Sun, Moon, Briefcase } from "lucide-react";
import { clsx } from "clsx";

interface CustomTask {
    id: string;
    title: string;
    isCompleted: boolean;
    category: string;
    time?: string;
}

interface FocusData {
    customTasks?: CustomTask[];
    [key: string]: unknown; // Allow other fields
}

export function DailyFocus() {
    // const router = useRouter(); // Unused
    const [task, setTask] = useState<FocusData | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshKey, setRefreshKey] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalCategory, setModalCategory] = useState<string>("All"); // All, Morning, Work, Night
    const [newTaskInput, setNewTaskInput] = useState("");

    const handleAddTask = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTaskInput.trim()) return;

        // Map UI category to DB category
        let dbCategory = modalCategory;
        if (modalCategory === "Work") dbCategory = "Goal";
        if (modalCategory === "All") dbCategory = "Morning";

        const newTask = {
            id: crypto.randomUUID(),
            title: newTaskInput.trim(),
            isCompleted: false,
            category: dbCategory,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        const updatedTasks = [...(task?.customTasks || []), newTask];
        const newTaskState = { ...task, customTasks: updatedTasks };

        // Optimistic update
        setTask(newTaskState);
        setNewTaskInput("");

        await updateTaskState({ customTasks: updatedTasks });
    }

    const userEmail = "adhisami2003@gmail.com";

    useEffect(() => {
        async function fetchTodayFocus() {
            try {
                const res = await fetch(`/api/focus/today?email=${userEmail}`);
                const data = await res.json();
                if (data.success && data.data) {
                    setTask(data.data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchTodayFocus();
    }, [refreshKey, userEmail]);

    async function toggleCustomTask(id: string) {
        if (!task || !task.customTasks) return;
        const updatedCustomTasks = task.customTasks.map((t: CustomTask) =>
            t.id === id ? { ...t, isCompleted: !t.isCompleted } : t
        );
        const newTaskState = { ...task, customTasks: updatedCustomTasks };
        setTask(newTaskState);
        await updateTaskState({ customTasks: updatedCustomTasks });
    }

    async function updateTaskState(updates: Partial<FocusData>) {
        try {
            await fetch("/api/focus/today", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: userEmail, ...updates }),
            });
            setRefreshKey(prev => prev + 1);
        } catch (err) { console.error(err); }
    }

    // Filter Tasks
    const allTasks = task?.customTasks || [];
    const morningTasks = allTasks.filter((t: CustomTask) => t.category === "Morning");
    const workTasks = allTasks.filter((t: CustomTask) => t.category === "Goal"); // 'Goal' map as Work
    const nightTasks = allTasks.filter((t: CustomTask) => t.category === "Night");

    // Helper to calc progress
    const getProgress = (tasks: CustomTask[]) => {
        const total = tasks.length;
        const completed = tasks.filter((t: CustomTask) => t.isCompleted).length;
        const pct = total === 0 ? 0 : Math.round((completed / total) * 100);
        return { total, completed, pct };
    };

    const morningStats = getProgress(morningTasks);
    const workStats = getProgress(workTasks);
    const nightStats = getProgress(nightTasks);

    // Filter for Modal
    const getModalTasks = () => {
        if (modalCategory === "Morning") return morningTasks;
        if (modalCategory === "Work") return workTasks;
        if (modalCategory === "Night") return nightTasks;
        return allTasks;
    };

    const modalTasks = getModalTasks();
    const modalStats = getProgress(modalTasks);

    if (loading && !task) {
        return (
            <div className="flex h-64 w-full items-center justify-center rounded-3xl bg-white/50 p-8 backdrop-blur-xl dark:bg-zinc-900/50">
                <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
            </div>
        );
    }

    interface RoutineCardProps {
        title: string;
        stats: { total: number; completed: number; pct: number };
        icon: React.ElementType;
        onClick: () => void;
        colorClass?: string;
        darkColorClass?: string; // unused but kept for prop structure if needed
        iconColor?: string;
    }

    // Reusable Card Component
    const RoutineCard = ({ title, stats, icon: Icon, onClick, colorClass, darkColorClass, iconColor }: RoutineCardProps) => {
        const isComplete = stats.total > 0 && stats.pct === 100;

        // Map titles to specific fill colors for the "water"
        const fillColors: Record<string, string> = {
            "Morning": "bg-orange-500/20 dark:bg-orange-500/30",
            "Work": "bg-blue-500/20 dark:bg-blue-500/30",
            "Night": "bg-indigo-500/20 dark:bg-indigo-500/30",
        };
        const fillColor = fillColors[title] || "bg-zinc-200/50";

        return (
            <button
                onClick={onClick}
                className={clsx(
                    "group relative flex flex-col items-center justify-center gap-3 overflow-hidden rounded-[1.5rem] p-2 aspect-square shadow-lg transition-all duration-500 hover:scale-[1.02] active:scale-95",
                    isComplete
                        ? "bg-emerald-50 ring-2 ring-emerald-500 dark:bg-emerald-900/10 dark:ring-emerald-500/50"
                        : "bg-white ring-1 ring-zinc-100 dark:bg-zinc-900 dark:ring-zinc-800"
                )}
            >
                {/* Water Fill Effect */}
                <div
                    className={clsx(
                        "absolute bottom-0 left-0 right-0 transition-all duration-1000 ease-in-out",
                        isComplete ? "bg-emerald-500/20" : fillColor
                    )}
                    style={{ height: `${stats.pct}%` }}
                />

                {/* Hover Gradient (Original) */}
                <div className={clsx(
                    "absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100 bg-gradient-to-br",
                    isComplete ? "from-emerald-500/10 to-green-500/10 opacity-100" : colorClass
                )} />

                <div className={clsx(
                    "relative flex h-10 w-10 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-full shadow-inner z-10 transition-colors",
                    isComplete ? "bg-emerald-100 dark:bg-emerald-900/30" : "bg-zinc-50 dark:bg-zinc-800"
                )}>
                    {isComplete ? (
                        <Check className="h-5 w-5 sm:h-7 sm:w-7 text-emerald-600 dark:text-emerald-400" strokeWidth={2.5} />
                    ) : (
                        <Icon className={clsx("h-5 w-5 sm:h-7 sm:w-7", iconColor)} strokeWidth={1.5} />
                    )}

                    {stats.total > 0 && !isComplete && (
                        <div className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-green-500 text-[9px] font-bold text-white shadow-lg ring-2 ring-white dark:ring-zinc-900">
                            {stats.completed}/{stats.total}
                        </div>
                    )}
                </div>

                <div className="flex flex-col items-center relative z-10">
                    <h2 className={clsx("text-sm sm:text-base font-bold", isComplete ? "text-emerald-700 dark:text-emerald-300" : "text-zinc-900 dark:text-white")}>{title}</h2>
                    <div className="flex items-center gap-2">
                        <p className={clsx("text-[10px] sm:text-xs font-medium transition-colors",
                            isComplete ? "text-emerald-600/70 dark:text-emerald-400/70" : "text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300"
                        )}>
                            {isComplete ? "Completed" : `${stats.pct}% Done`}
                        </p>
                    </div>
                </div>
            </button>
        );
    };

    return (
        <div className="flex flex-col items-center pb-20 w-full">

            {/* Header Date */}
            <div className="mt-4 mb-6 flex items-center gap-2 rounded-full bg-zinc-100 px-4 py-2 text-xs font-medium text-zinc-400 dark:bg-zinc-900">
                <CalendarDays className="h-3 w-3" />
                <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
            </div>

            {/* Grid for Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full max-w-4xl px-4">
                <RoutineCard
                    title="Morning"
                    stats={morningStats}
                    icon={Sun}
                    iconColor="text-orange-500"
                    colorClass="from-orange-500/10 to-yellow-500/10"
                    onClick={() => { setModalCategory("Morning"); setIsModalOpen(true); }}
                />
                <RoutineCard
                    title="Work"
                    stats={workStats}
                    icon={Briefcase}
                    iconColor="text-blue-500"
                    colorClass="from-blue-500/10 to-indigo-500/10"
                    onClick={() => { setModalCategory("Work"); setIsModalOpen(true); }}
                />
                <RoutineCard
                    title="Night"
                    stats={nightStats}
                    icon={Moon}
                    iconColor="text-indigo-500"
                    colorClass="from-indigo-500/10 to-purple-500/10"
                    onClick={() => { setModalCategory("Night"); setIsModalOpen(true); }}
                />
            </div>

            {/* ROUTINE POPUP MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
                    <div className="relative w-full max-w-lg overflow-hidden rounded-[2.5rem] bg-white shadow-2xl animate-in slide-in-from-bottom-10 zoom-in-95 duration-300 dark:bg-zinc-950">
                        {/* Header */}
                        <div className="relative flex items-center justify-between border-b border-zinc-100 p-6 sm:p-8 dark:border-zinc-800">
                            <div>
                                <h3 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white">{modalCategory} Routine</h3>
                                <p className="text-xs sm:text-sm font-medium text-zinc-400">{modalStats.completed} of {modalStats.total} tasks completed</p>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="rounded-full bg-zinc-100 p-2 sm:p-3 text-zinc-500 transition-colors hover:bg-zinc-200 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800"
                            >
                                <X className="h-5 w-5 sm:h-6 sm:w-6" />
                            </button>
                        </div>

                        {/* List */}
                        <div className="max-h-[60vh] overflow-y-auto p-4 sm:p-6 scrollbar-hide">
                            <div className="space-y-3">
                                {modalTasks.length > 0 ? (
                                    modalTasks.map((t: CustomTask) => (
                                        <button
                                            key={t.id}
                                            onClick={() => toggleCustomTask(t.id)}
                                            className={clsx(
                                                "group flex w-full items-center gap-3 sm:gap-4 rounded-3xl border p-3 sm:p-4 text-left transition-all active:scale-[0.98]",
                                                t.isCompleted
                                                    ? "border-green-200 bg-green-50/50 dark:border-green-900/20 dark:bg-green-900/10"
                                                    : "border-zinc-100 bg-white hover:border-purple-200 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-purple-900/50"
                                            )}
                                        >
                                            <div className={clsx(
                                                "flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-2xl transition-colors",
                                                t.isCompleted
                                                    ? "bg-green-500 text-white"
                                                    : "bg-zinc-100 text-zinc-400 group-hover:bg-purple-100 group-hover:text-purple-600 dark:bg-zinc-800 dark:group-hover:bg-purple-900/30 dark:group-hover:text-purple-400"
                                            )}>
                                                {t.isCompleted ? <Check className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={3} /> : <Target className="h-5 w-5 sm:h-6 sm:w-6" />}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className={clsx(
                                                    "text-base sm:text-lg font-bold truncate transition-all",
                                                    t.isCompleted ? "text-green-800 line-through opacity-50 dark:text-green-200" : "text-zinc-900 dark:text-white"
                                                )}>
                                                    {t.title}
                                                </div>
                                                <div className="flex items-center gap-2 mt-1">
                                                    {t.category && (
                                                        <span className="inline-flex items-center rounded-md bg-zinc-100 px-2 py-0.5 text-[10px] sm:text-xs font-semibold text-zinc-500 dark:bg-zinc-800">
                                                            {t.category}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </button>
                                    ))
                                ) : (
                                    <div className="flex min-h-[200px] flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50">
                                        <div className="rounded-full bg-zinc-100 p-4 dark:bg-zinc-900">
                                            <Sparkles className="h-6 w-6 text-zinc-400" />
                                        </div>
                                        <p className="text-sm font-medium text-zinc-400">No {modalCategory} tasks set.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Footer - Inline Add */}
                        <div className="p-4 sm:p-5 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 padding-bottom-safe">
                            <form onSubmit={handleAddTask} className="flex gap-2">
                                <input
                                    type="text"
                                    value={newTaskInput}
                                    onChange={(e) => setNewTaskInput(e.target.value)}
                                    placeholder={`Add a ${modalCategory} task...`}
                                    className="flex-1 rounded-xl bg-white px-4 py-3 text-sm font-medium text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 shadow-sm dark:bg-zinc-800 dark:text-white dark:focus:ring-purple-500/40"
                                />
                                <button
                                    type="submit"
                                    disabled={!newTaskInput.trim()}
                                    className="rounded-xl bg-zinc-900 px-4 py-2 font-bold text-white transition-all hover:bg-zinc-800 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                                >
                                    Add
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

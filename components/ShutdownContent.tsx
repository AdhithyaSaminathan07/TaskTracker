"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ArrowLeft, Loader2, Moon, PowerOff } from "lucide-react";
import { clsx } from "clsx";
import Link from "next/link";

export function ShutdownContent() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

    const userEmail = "adhisami2003@gmail.com";

    const checklist = [
        "Commit & Push changes 💾",
        "Review today's progress 📊",
        "Plan 3 prioritized tasks for tomorrow 📅",
        "Close all tabs & apps 🧹",
        "Physical disconnect (Desk clear) ✨"
    ];

    const allChecked = checklist.every((_, i) => checkedItems[i]);

    const toggleCheck = (index: number) => {
        setCheckedItems(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    async function completeShutdown() {
        setLoading(true);
        try {
            await fetch("/api/focus/today", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: userEmail,
                    modShutdown: true
                }),
            });
            router.push("/dashboard/focus");
            router.refresh();
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex min-h-screen flex-col bg-white p-6 transition-colors dark:bg-zinc-950">
            {/* Header */}
            <div className="mb-6 flex justify-between items-center">
                <Link href="/dashboard/focus" className="inline-flex items-center justify-center rounded-full bg-zinc-100 p-3 text-zinc-500 transition-all hover:bg-zinc-200 hover:text-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
                    <ArrowLeft className="h-5 w-5" />
                </Link>
                <div className="flex items-center gap-1 rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-600 dark:bg-red-900/20 dark:text-red-300">
                    <PowerOff className="h-3 w-3" />
                    <span>PROTOCOL: SHUTDOWN</span>
                </div>
            </div>

            <div className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center pb-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="mb-10 text-center">
                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-red-100 text-red-600 shadow-xl shadow-red-200/50 dark:bg-red-900/20 dark:text-red-400 dark:shadow-none">
                        <Moon className="h-10 w-10" />
                    </div>
                    <h1 className="mb-3 text-4xl font-black tracking-tight text-zinc-900 dark:text-white">System Shutdown</h1>
                    <p className="text-lg font-medium text-zinc-500 dark:text-zinc-400">
                        Graceful termination protocol.
                    </p>
                </div>

                <div className="space-y-4">
                    {checklist.map((item, i) => (
                        <button
                            key={i}
                            onClick={() => toggleCheck(i)}
                            className={clsx(
                                "group flex w-full items-center gap-4 rounded-2xl border p-5 text-left transition-all duration-300 active:scale-[0.98]",
                                checkedItems[i]
                                    ? "border-red-200 bg-red-50/50 dark:border-red-900/30 dark:bg-red-900/10"
                                    : "border-zinc-100 bg-white hover:border-zinc-200 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700 shadow-sm"
                            )}
                        >
                            <div className={clsx(
                                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300",
                                checkedItems[i]
                                    ? "border-red-500 bg-red-500 text-white rotate-0"
                                    : "border-zinc-200 text-transparent dark:border-zinc-700"
                            )}>
                                <Check className="h-4 w-4" strokeWidth={3} />
                            </div>
                            <span className={clsx(
                                "text-lg font-medium transition-all",
                                checkedItems[i] ? "text-red-800 line-through opacity-60 dark:text-red-100" : "text-zinc-700 dark:text-zinc-200"
                            )}>
                                {item}
                            </span>
                        </button>
                    ))}
                </div>

                <div className="mt-12">
                    <button
                        onClick={completeShutdown}
                        className={clsx(
                            "relative w-full overflow-hidden rounded-3xl py-5 text-xl font-bold text-white shadow-2xl transition-all duration-300 hover:scale-[1.02] active:scale-95",
                            allChecked
                                ? "bg-red-600 shadow-red-600/30 hover:bg-red-500"
                                : "bg-zinc-900 dark:bg-white dark:text-black"
                        )}
                    >
                        <div className="relative z-10 flex items-center justify-center gap-3">
                            {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : (
                                <>
                                    <span>System Offline</span>
                                    <PowerOff className="h-5 w-5" />
                                </>
                            )}
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
}

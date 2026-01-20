"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Power, Check, ArrowLeft, Loader2, Clock, Sparkles } from "lucide-react";
import { clsx } from "clsx";
import Link from "next/link";

export function BootContent() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

    const userEmail = "adhisami2003@gmail.com";

    const checklist = [
        "Wake up + water",
        "Quick stretch / walk (5–10 min)",
        "Open task list / Notion",
        "Decide TODAY’S MAIN FEATURE / TASK",
        "No social media till first commit"
    ];

    const allChecked = checklist.every((_, i) => checkedItems[i]);

    const toggleCheck = (index: number) => {
        setCheckedItems(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    async function completeBoot() {
        setLoading(true);
        try {
            await fetch("/api/focus/today", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: userEmail,
                    modSystemBoot: true
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
                <div className="flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-600 dark:bg-green-900/20 dark:text-green-300">
                    <Power className="h-3 w-3" />
                    <span>PROTOCOL: BOOT</span>
                </div>
            </div>

            <div className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center pb-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="mb-10 text-center">
                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-green-100 text-green-600 shadow-xl shadow-green-200/50 dark:bg-green-900/20 dark:text-green-400 dark:shadow-none">
                        <Power className="h-10 w-10" />
                    </div>
                    <h1 className="mb-3 text-4xl font-black tracking-tight text-zinc-900 dark:text-white">System Boot</h1>
                    <p className="text-lg font-medium text-zinc-500 dark:text-zinc-400">
                        Initialize your mind for high performance.
                    </p>
                    <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-zinc-200 px-3 py-1 text-xs font-bold uppercase tracking-wider text-zinc-400 dark:border-zinc-800">
                        <Clock className="h-3 w-3" />
                        <span>Est. 20–30 mins</span>
                    </div>
                </div>

                <div className="space-y-4">
                    {checklist.map((item, i) => (
                        <button
                            key={i}
                            onClick={() => toggleCheck(i)}
                            className={clsx(
                                "group flex w-full items-center gap-4 rounded-2xl border p-5 text-left transition-all duration-300 active:scale-[0.98]",
                                checkedItems[i]
                                    ? "border-green-200 bg-green-50/50 dark:border-green-900/30 dark:bg-green-900/10"
                                    : "border-zinc-100 bg-white hover:border-zinc-200 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700 shadow-sm"
                            )}
                        >
                            <div className={clsx(
                                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300",
                                checkedItems[i]
                                    ? "border-green-500 bg-green-500 text-white rotate-0"
                                    : "border-zinc-200 text-transparent dark:border-zinc-700"
                            )}>
                                <Check className="h-4 w-4" strokeWidth={3} />
                            </div>
                            <span className={clsx(
                                "text-lg font-medium transition-all",
                                checkedItems[i] ? "text-green-800 line-through opacity-60 dark:text-green-100" : "text-zinc-700 dark:text-zinc-200"
                            )}>
                                {item}
                            </span>
                        </button>
                    ))}
                </div>

                <div className="mt-12">
                    <button
                        onClick={completeBoot}
                        className={clsx(
                            "relative w-full overflow-hidden rounded-3xl py-5 text-xl font-bold text-white shadow-2xl transition-all duration-300 hover:scale-[1.02] active:scale-95",
                            allChecked
                                ? "bg-green-600 shadow-green-600/30 hover:bg-green-500"
                                : "bg-zinc-900 dark:bg-white dark:text-black"
                        )}
                    >
                        <div className="relative z-10 flex items-center justify-center gap-3">
                            {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : (
                                <>
                                    <span>System Online</span>
                                    {allChecked ? <Sparkles className="h-5 w-5" /> : <Power className="h-5 w-5" />}
                                </>
                            )}
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
}

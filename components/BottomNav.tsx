"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, User, Zap, Settings, CheckCircle2, PlusCircle, Wallet, Target, Utensils } from "lucide-react";
import { clsx } from "clsx";

export function BottomNav() {
    const pathname = usePathname();

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
            {/* Full Width Bar Container */}
            <nav className="relative grid grid-cols-5 items-center border-t border-zinc-200 bg-white px-6 pb-4 pt-3 shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.05)] dark:border-zinc-800 dark:bg-zinc-950">

                {/* Task Button (Was Home) */}
                <Link
                    href="/dashboard/focus"
                    className={clsx(
                        "flex flex-col items-center gap-1 transition-all active:scale-95",
                        pathname === "/dashboard/focus"
                            ? "text-purple-600 dark:text-purple-400"
                            : "text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300"
                    )}
                >
                    <div className={clsx("rounded-xl p-1", pathname === "/dashboard/focus" && "bg-purple-50 dark:bg-purple-900/20")}>
                        <CheckCircle2 className="h-6 w-6" strokeWidth={2.5} />
                    </div>
                    <span className="text-[10px] font-medium">Task</span>
                </Link>

                {/* History Button */}
                <Link
                    href="/dashboard/expenses"
                    className={clsx(
                        "flex flex-col items-center gap-1 transition-all active:scale-95",
                        pathname === "/dashboard/expenses"
                            ? "text-purple-600 dark:text-purple-400"
                            : "text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300"
                    )}
                >
                    <div className={clsx("rounded-xl p-1", pathname === "/dashboard/expenses" && "bg-purple-50 dark:bg-purple-900/20")}>
                        <Wallet className="h-6 w-6" strokeWidth={2.5} />
                    </div>
                    <span className="text-[10px] font-medium">Expenses</span>
                </Link>

                {/* Center Dashboard Button (Was Focus) */}
                <div className="relative -top-6 flex justify-center">
                    <Link
                        href="/dashboard"
                        className={clsx(
                            "flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-xl shadow-purple-600/30 transition-all hover:scale-105 active:scale-95 ring-4 ring-white dark:ring-zinc-950"
                        )}
                    >
                        <Zap className="h-7 w-7 fill-white" />
                    </Link>
                </div>

                <Link
                    href="/dashboard/plans"
                    className={clsx(
                        "flex flex-col items-center gap-1 transition-all active:scale-95",
                        pathname === "/dashboard/plans"
                            ? "text-purple-600 dark:text-purple-400"
                            : "text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300"
                    )}
                >
                    <div className={clsx("rounded-xl p-1", pathname === "/dashboard/plans" && "bg-purple-50 dark:bg-purple-900/20")}>
                        <Target className="h-6 w-6" strokeWidth={2.5} />
                    </div>
                    <span className="text-[10px] font-medium">Plans</span>
                </Link>

                {/* Meals Button (Replaces Settings) */}
                <Link
                    href="/dashboard/meals"
                    className={clsx(
                        "flex flex-col items-center gap-1 transition-all active:scale-95",
                        pathname === "/dashboard/meals"
                            ? "text-purple-600 dark:text-purple-400"
                            : "text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300"
                    )}
                >
                    <div className={clsx("rounded-xl p-1", pathname === "/dashboard/meals" && "bg-purple-50 dark:bg-purple-900/20")}>
                        <Utensils className="h-6 w-6" strokeWidth={2.5} />
                    </div>
                    <span className="text-[10px] font-medium">Meals</span>
                </Link>
            </nav>
        </div>
    );
}

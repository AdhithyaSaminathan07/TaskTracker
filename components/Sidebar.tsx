"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LayoutDashboard, CheckSquare, Calendar, Settings, LogOut, X, CheckCircle2, User, Plus, Wallet, Target, Utensils } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Weekly Plans", href: "/dashboard/plans", icon: Target },
    { name: "Task", href: "/dashboard/focus", icon: CheckCircle2 },
    { name: "Daily Expenses", href: "/dashboard/expenses", icon: Wallet },
    { name: "Meals", href: "/dashboard/meals", icon: Utensils },
    { name: "Profile", href: "/dashboard/profile", icon: User },
];

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
    const pathname = usePathname();

    return (
        <>
            {/* Mobile Backdrop */}
            <div
                className={clsx(
                    "fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden",
                    isOpen ? "block" : "hidden"
                )}
                onClick={onClose}
            />

            {/* Sidebar Container */}
            <aside
                className={clsx(
                    "fixed inset-y-0 left-0 z-50 w-64 transform border-r border-zinc-200 bg-white shadow-xl transition-transform duration-300 dark:border-zinc-800 dark:bg-zinc-950 lg:static lg:translate-x-0",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="flex h-full flex-col">
                    {/* Logo Area */}
                    <div className="flex h-16 items-center justify-between px-6 border-b border-zinc-200 dark:border-zinc-800">
                        <Link href="/dashboard" className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-lg bg-purple-600 flex items-center justify-center text-white font-bold">
                                T
                            </div>
                            <span className="text-xl font-bold text-zinc-900 dark:text-white">
                                TaskTracker
                            </span>
                        </Link>
                        <button
                            onClick={onClose}
                            className="rounded-lg p-1 text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900 lg:hidden"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    {/* Navigation Links */}
                    <nav className="flex-1 space-y-1 px-3 py-6">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            const Icon = item.icon;

                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={twMerge(
                                        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                                        isActive
                                            ? "bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400"
                                            : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50"
                                    )}
                                >
                                    <Icon className="h-5 w-5" />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User Profile / Logout */}
                    <div className="border-t border-zinc-200 p-4 dark:border-zinc-800">
                        <button
                            onClick={async () => {
                                localStorage.removeItem("user_data");
                                await signOut({ callbackUrl: "/" });
                            }}
                            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 transition-all hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/10"
                        >
                            <LogOut className="h-5 w-5" />
                            Sign Out
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
}

"use client";
import Link from "next/link";
import { Menu, User, Bell } from "lucide-react";

interface HeaderProps {
    onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
    return (
        <header className="flex h-16 w-full items-center justify-between border-b border-zinc-200 bg-white px-6 dark:border-zinc-800 dark:bg-zinc-950">
            {/* Left: Mobile Menu & Title */}
            <div className="flex items-center gap-4">
                <button
                    onClick={onMenuClick}
                    className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900 lg:hidden"
                >
                    <Menu className="h-6 w-6" />
                </button>
                <div className="hidden md:block">
                    <h2 className="text-lg font-semibold text-zinc-900 dark:text-gray-100">
                        Daily Tracker
                    </h2>
                </div>
            </div>

            {/* Right: Actions & Profile */}
            <div className="flex items-center gap-4">
                <button className="rounded-full p-2 text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900">
                    <Bell className="h-5 w-5" />
                </button>

                <div className="h-8 w-px bg-zinc-200 dark:bg-zinc-800"></div>

                <Link href="/dashboard/profile" className="flex items-center gap-2 rounded-full bg-zinc-100 px-3 py-1.5 transition-colors hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-600 text-[10px] font-bold text-white">
                        JD
                    </div>
                    <span className="hidden text-sm font-medium text-zinc-700 dark:text-zinc-300 md:block">
                        John Doe
                    </span>
                </Link>
            </div>
        </header>
    );
}

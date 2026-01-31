"use client";

import { LogOut, User, Settings, Bell, Shield, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { clsx } from "clsx";

export function ProfileContent() {
    const router = useRouter();

    const [user, setUser] = useState<{ name: string; email: string } | null>(null);

    useEffect(() => {
        const userData = localStorage.getItem("user_data");
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    const handleLogout = async () => {
        localStorage.removeItem("user_data");
        await signOut({ callbackUrl: "/" });
    };

    return (
        <div className="space-y-6 pb-24">
            {/* Header Section */}
            <div className="relative overflow-hidden rounded-[2.5rem] bg-zinc-900 p-8 text-white shadow-2xl transition-all dark:bg-black dark:shadow-purple-900/20">
                {/* Background Decor */}
                <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-pink-600/30 blur-3xl"></div>
                <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-purple-600/20 blur-3xl"></div>

                <div className="relative z-10 flex flex-col items-center text-center sm:items-start sm:text-left">
                    <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-4xl font-bold text-white shadow-xl shadow-purple-500/30">
                        {user?.name?.[0]?.toUpperCase() || "U"}
                    </div>
                    <h1 className="text-3xl font-bold leading-tight">{user?.name || "User"}</h1>
                    <p className="mt-2 text-white/60">{user?.email || ""}</p>
                    <div className="mt-4 flex gap-2">
                        <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white backdrop-blur-md">
                            <Sparkles className="h-3 w-3 text-yellow-400" />
                            Pro Member
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
                {/* Preferences */}
                <div className="overflow-hidden rounded-[2rem] border border-zinc-100 bg-white p-6 shadow-sm transition-all dark:border-zinc-800 dark:bg-zinc-900">
                    <h3 className="mb-6 flex items-center gap-2 text-lg font-bold text-zinc-900 dark:text-white">
                        <Settings className="h-5 w-5 text-zinc-400" />
                        Preferences
                    </h3>
                    <div className="space-y-4">
                        <button className="flex w-full items-center justify-between rounded-2xl bg-zinc-50 p-4 transition-colors hover:bg-zinc-100 dark:bg-zinc-800 dark:hover:bg-zinc-700/50">
                            <span className="font-medium text-zinc-700 dark:text-zinc-300">Dark Mode</span>
                            <div className="h-6 w-11 rounded-full bg-zinc-300 dark:bg-zinc-600"></div>
                        </button>
                        <button className="flex w-full items-center justify-between rounded-2xl bg-zinc-50 p-4 transition-colors hover:bg-zinc-100 dark:bg-zinc-800 dark:hover:bg-zinc-700/50">
                            <span className="font-medium text-zinc-700 dark:text-zinc-300">Notifications</span>
                            <div className="h-6 w-11 rounded-full bg-purple-600"></div>
                        </button>
                    </div>
                </div>

                {/* Account */}
                <div className="overflow-hidden rounded-[2rem] border border-zinc-100 bg-white p-6 shadow-sm transition-all dark:border-zinc-800 dark:bg-zinc-900">
                    <h3 className="mb-6 flex items-center gap-2 text-lg font-bold text-zinc-900 dark:text-white">
                        <Shield className="h-5 w-5 text-zinc-400" />
                        Account
                    </h3>
                    <div className="space-y-4">
                        <button className="flex w-full items-center justify-between rounded-2xl bg-zinc-50 p-4 transition-colors hover:bg-zinc-100 dark:bg-zinc-800 dark:hover:bg-zinc-700/50">
                            <span className="font-medium text-zinc-700 dark:text-zinc-300">Change Password</span>
                            <Settings className="h-5 w-5 text-zinc-400" />
                        </button>
                        <button
                            onClick={handleLogout}
                            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 p-4 font-bold text-red-600 transition-all hover:bg-red-100 active:scale-95 dark:border-red-900/30 dark:bg-red-900/10 dark:text-red-400 dark:hover:bg-red-900/20"
                        >
                            <LogOut className="h-5 w-5" />
                            Log Out
                        </button>
                    </div>
                </div>
            </div>

            <div className="text-center text-xs font-medium text-zinc-400">
                Task Tracker v1.0.0 • Built for Focus
            </div>
        </div>
    );
}

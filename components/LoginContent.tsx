"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export function LoginContent() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        const email = formData.get("email");
        const password = formData.get("password");

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Login failed");
            }

            // Successful login
            router.push("/dashboard");
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen w-full iems-center justify-center bg-zinc-50 dark:bg-black font-sans relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-500/30 rounded-full blur-[120px] pointer-events-none mix-blend-screen animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/30 rounded-full blur-[120px] pointer-events-none mix-blend-screen animate-pulse delay-1000" />

            <div className="z-10 w-full max-w-md p-6">
                <div className="rounded-2xl border border-zinc-200 bg-white/50 p-8 shadow-xl backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-900/50">
                    <div className="mb-8 flex flex-col items-center text-center">
                        <h1 className="mb-2 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                            Welcome back
                        </h1>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">
                            Enter your email to sign in to your account
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900 rounded-lg">
                                {error}
                            </div>
                        )}
                        <div>
                            <label
                                htmlFor="email"
                                className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                            >
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="name@example.com"
                                required
                                className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm outline-none transition-all placeholder:text-zinc-400 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 dark:border-zinc-800 dark:bg-zinc-950 dark:focus:border-purple-500"
                            />
                        </div>
                        <div>
                            <div className="mb-1.5 flex items-center justify-between">
                                <label
                                    htmlFor="password"
                                    className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
                                >
                                    Password
                                </label>
                                <Link
                                    href="/forgot-password"
                                    className="text-sm text-purple-600 hover:text-purple-500 dark:text-purple-400"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm outline-none transition-all placeholder:text-zinc-400 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 dark:border-zinc-800 dark:bg-zinc-950 dark:focus:border-purple-500"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-2 w-full flex items-center justify-center rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-purple-500 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-purple-600/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                "Sign In"
                            )}
                        </button>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-zinc-200 dark:border-zinc-800"></div>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-transparent px-2 text-zinc-500 dark:text-zinc-400 backdrop-blur-xl">
                                    Or continue with
                                </span>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                className="flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 transition-all hover:bg-zinc-50 hover:text-zinc-900 focus:outline-none focus:ring-4 focus:ring-zinc-200 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-zinc-50 dark:focus:ring-zinc-800"
                            >
                                <svg className="h-4 w-4" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12.0003 0C5.37274 0 0 5.37273 0 12C0 17.3023 3.43818 21.8 8.2046 23.3864C8.80461 23.4955 9.02279 23.125 9.02279 22.8091C9.02279 22.525 9.01369 21.7727 9.00915 20.775C5.6705 21.5 4.96642 19.1636 4.96642 19.1636C4.42051 17.7773 3.63414 17.4068 3.63414 17.4068C2.54551 16.6636 3.71687 16.6795 3.71687 16.6795C4.92051 16.7636 5.55278 17.9159 5.55278 17.9159C6.62279 19.75 8.36142 19.2205 9.04551 18.9136C9.15233 18.1386 9.46369 17.6114 9.80688 17.3114C7.14324 17.0091 4.34324 15.9795 4.34324 11.3773C4.34324 10.0682 4.80915 8.99545 5.57097 8.16136C5.44597 7.85909 5.03415 6.63409 5.68688 4.98409C5.68688 4.98409 6.69324 4.66136 8.98188 6.21136C9.93869 5.94545 10.9637 5.81136 11.9864 5.80682C13.0091 5.81136 14.0341 5.94545 14.9932 6.21136C17.2819 4.66136 18.2864 4.98409 18.2864 4.98409C18.941 6.63409 18.5319 7.85909 18.4069 8.16136C19.1728 8.99545 19.6364 10.0682 19.6364 11.3773C19.6364 15.9932 16.8319 16.9977 14.1637 17.2955C14.5978 17.6682 14.9864 18.4068 14.9864 19.5364C14.9864 21.1545 14.9728 22.4636 14.9728 22.8091C14.9728 23.1318 15.1887 23.5068 15.8001 23.3841C20.5637 21.7955 24 17.3 24 12C24 5.37273 18.6273 0 12.0003 0Z" />
                                </svg>
                                Github
                            </button>
                            <button
                                type="button"
                                className="flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 transition-all hover:bg-zinc-50 hover:text-zinc-900 focus:outline-none focus:ring-4 focus:ring-zinc-200 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-zinc-50 dark:focus:ring-zinc-800"
                            >
                                <svg className="h-4 w-4" aria-hidden="true" viewBox="0 0 24 24">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                                Google
                            </button>
                        </div>

                        <p className="mt-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
                            Don&apos;t have an account?{" "}
                            <Link
                                href="/signup"
                                className="font-semibold text-purple-600 hover:text-purple-500 dark:text-purple-400"
                            >
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

"use client";

import Link from "next/link";
import { useState } from "react";
import { Loader2, ArrowLeft } from "lucide-react";

export function ForgotPasswordContent() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        // Mock API call for now
        try {
            // await fetch('/api/auth/forgot-password', ...);
            await new Promise(resolve => setTimeout(resolve, 1500));
            setSuccess(true);
        } catch (err) {
            setError("Failed to send reset email. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-zinc-50 dark:bg-black font-sans relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-500/30 rounded-full blur-[120px] pointer-events-none mix-blend-screen animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/30 rounded-full blur-[120px] pointer-events-none mix-blend-screen animate-pulse delay-1000" />

            <div className="z-10 w-full max-w-md p-6">
                <div className="rounded-2xl border border-zinc-200 bg-white/50 p-8 shadow-xl backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-900/50">
                    <div className="mb-8 flex flex-col items-center text-center">
                        <h1 className="mb-2 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                            Reset Password
                        </h1>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">
                            Enter your email to receive recovery instructions
                        </p>
                    </div>

                    {!success ? (
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
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="name@example.com"
                                    required
                                    className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm outline-none transition-all placeholder:text-zinc-400 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 dark:border-zinc-800 dark:bg-zinc-950 dark:focus:border-purple-500"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="mt-2 w-full flex items-center justify-center rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-purple-500 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-purple-600/20 active:scale-[0.98] disabled:opacity-50"
                            >
                                {loading ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    "Send Reset Link"
                                )}
                            </button>
                        </form>
                    ) : (
                        <div className="text-center space-y-4">
                            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check"><path d="M20 6 9 17l-5-5" /></svg>
                            </div>
                            <p className="text-zinc-600 dark:text-zinc-300">
                                If an account exists for <strong>{email}</strong>, you will receive password reset instructions shortly.
                            </p>
                        </div>
                    )}

                    <div className="mt-8 text-center">
                        <Link
                            href="/login"
                            className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

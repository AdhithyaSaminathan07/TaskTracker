"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function SignupContent() {
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        const name = formData.get("name");
        const email = formData.get("email");
        const password = formData.get("password");

        try {
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Something went wrong");
            }

            // Successful signup, redirect to dashboard
            localStorage.setItem("user_data", JSON.stringify(data.data));
            router.push("/dashboard");
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-zinc-50 dark:bg-black font-sans relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/30 rounded-full blur-[120px] pointer-events-none mix-blend-screen animate-pulse" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/30 rounded-full blur-[120px] pointer-events-none mix-blend-screen animate-pulse delay-1000" />

            <div className="z-10 w-full max-w-md p-6">
                <div className="rounded-2xl border border-zinc-200 bg-white/50 p-8 shadow-xl backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-900/50">
                    <div className="mb-8 flex flex-col items-center text-center">
                        <h1 className="mb-2 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                            Create an account
                        </h1>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">
                            Enter your details to get started
                        </p>
                    </div>

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        {error && (
                            <div className="text-red-500 text-sm text-center">{error}</div>
                        )}
                        <div>
                            <label
                                htmlFor="name"
                                className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                            >
                                Full Name
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                placeholder="John Doe"
                                required
                                className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm outline-none transition-all placeholder:text-zinc-400 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 dark:border-zinc-800 dark:bg-zinc-950 dark:focus:border-purple-500"
                            />
                        </div>
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
                            <label
                                htmlFor="password"
                                className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                            >
                                Password
                            </label>
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
                            className="mt-2 w-full rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-purple-500 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-purple-600/20 active:scale-[0.98] disabled:opacity-50"
                        >
                            {loading ? "Creating account..." : "Sign Up"}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
                        Already have an account?{" "}
                        <Link
                            href="/"
                            className="font-semibold text-purple-600 hover:text-purple-500 dark:text-purple-400"
                        >
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

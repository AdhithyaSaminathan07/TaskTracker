"use client";

import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import Image from "next/image";

export function LoginContent() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (status === "authenticated" && session?.user) {
            const userData = {
                id: (session.user as any).id,
                name: session.user.name,
                email: session.user.email
            };
            localStorage.setItem("user_data", JSON.stringify(userData));

            const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
            const target = (callbackUrl.includes("/login") || callbackUrl === "/") ? "/dashboard" : callbackUrl;

            router.push(target);
        }
    }, [status, session, router, searchParams]);

    const handleGoogleSignIn = () => {
        setIsLoading(true);
        signIn("google", { callbackUrl: "/" });
    };

    if (status === "loading") {
        return (
            <div className="flex min-h-screen w-full items-center justify-center bg-[#e8f3ea]">
                <Loader2 className="h-8 w-8 animate-spin text-[#4a6b52]" />
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#e8f3ea] font-sans overflow-hidden">
            {/* Left Side (Desktop) / TOP (Mobile) - Darker Green Area */}
            <div className="w-full lg:w-1/2 bg-[#88a990] flex flex-col items-center justify-center p-8 lg:p-12 relative text-center">

                {/* Logo Area */}
                <div className="absolute top-8 left-8 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white font-bold">
                        :)
                    </div>
                    <span className="text-xl font-bold text-[#1a3b22]">TaskTracker</span>
                </div>

                <div className="mt-12 lg:mt-0 flex flex-col items-center max-w-lg z-10">
                    <h1 className="text-3xl lg:text-4xl font-bold text-[#1a3b22] mb-8 font-serif sm:text-2xl">
                        Hey there! <br /> Let's get organized.
                    </h1>

                    {/* Illustration Container */}
                    <div className="relative w-full aspect-square max-w-md animate-fade-in-up">
                        <Image
                            src="/login-illustration.png"
                            alt="Productivity Illustration"
                            fill
                            className="object-contain drop-shadow-2xl"
                            priority
                        />
                    </div>
                </div>
            </div>

            {/* Right Side (Desktop) / Bottom (Mobile) - Light Area with Card */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-12 relative bg-[#e8f3ea]">
                <div className="w-full max-w-sm bg-white rounded-[2rem] shadow-xl p-8 lg:p-12 flex flex-col items-center text-center animate-fade-in-up delay-100">

                    <h2 className="text-2xl font-bold text-[#1a3b22] mb-4">Welcome Back</h2>
                    <p className="text-[#5a7b62] mb-8 text-sm">
                        Log in to access your casual dashboard.
                    </p>

                    {/* Google Button */}
                    <button
                        onClick={handleGoogleSignIn}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-3 bg-[#426b50] hover:bg-[#355740] text-white rounded-full px-6 py-4 font-medium transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed group"
                    >
                        {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin text-white" />
                        ) : (
                            <>
                                <div className="bg-white rounded-full p-1 w-6 h-6 flex items-center justify-center">
                                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                                        <path
                                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                            fill="#4285F4"
                                        />
                                        <path
                                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                            fill="#34A853"
                                        />
                                        <path
                                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                            fill="#FBBC05"
                                        />
                                        <path
                                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                            fill="#EA4335"
                                        />
                                    </svg>
                                </div>
                                <span className="tracking-wide">Continue with Google</span>
                            </>
                        )}
                    </button>



                </div>
            </div>
        </div>
    );
}

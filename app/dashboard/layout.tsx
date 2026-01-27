"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { useRouter } from "next/navigation";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        const checkAuth = () => {
            try {
                const rawData = localStorage.getItem("user_data");
                console.log("[DashboardLayout] Checking auth. Raw data:", rawData);

                const userData = JSON.parse(rawData || "{}");
                console.log("[DashboardLayout] Parsed user data:", userData);

                if (!userData.id && !userData._id) {
                    console.error("[DashboardLayout] Missing ID in user data");
                    throw new Error("Missing ID");
                }

                console.log("[DashboardLayout] Auth successful");
                setIsAuthorized(true);
            } catch (e) {
                console.error("[DashboardLayout] Auth failed:", e);
                // Invalid or missing session
                router.replace("/"); // Go to login
            }
        };
        // Verify we are in the browser
        if (typeof window !== "undefined") {
            checkAuth();
        }
    }, [router]);

    if (!isAuthorized) {
        return null; // or a loading spinner
    }

    return (
        <div className="flex h-[100dvh] overflow-hidden bg-zinc-50 dark:bg-black">
            {/* Sidebar */}
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Main Content */}
            <div className="flex flex-1 flex-col min-w-0 transition-all duration-300 lg:ml-0">
                <Header onMenuClick={() => setSidebarOpen(true)} />

                <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 pb-24 sm:p-6 lg:p-8 lg:pb-8">
                    <div className="mx-auto max-w-4xl">
                        {children}
                    </div>
                </main>
            </div>

            {/* Mobile Bottom Nav */}
            <BottomNav />
        </div>
    );
}

"use client";

import { useEffect, useState } from "react";
import { clsx } from "clsx";

interface DayData {
    date: string;
    isCompleted: boolean;
    hasTask: boolean;
}

export function WeeklyTracker({ refreshTrigger }: { refreshTrigger: number }) {
    const [weekData, setWeekData] = useState<DayData[]>([]);
    const userEmail = "adhisami2003@gmail.com";

    useEffect(() => {
        async function fetchWeekData() {
            try {
                const res = await fetch(`/api/focus/week?email=${userEmail}`);
                const data = await res.json();
                if (data.success) {
                    setWeekData(data.data);
                }
            } catch (err) {
                console.error(err);
            }
        }
        fetchWeekData();
    }, [refreshTrigger, userEmail]);

    return (
        <div className="flex justify-between gap-1 overflow-x-auto pb-4 sm:justify-start sm:gap-4">
            {weekData.map((day) => {
                const dateObj = new Date(day.date);
                // Fix for timezone offset issues when parsing YYYY-MM-DD
                // We'll just create it with the date string and ensuring it displays usually.
                // Actually, let's just use the day index or simple parsing.

                // Simpler approach for display day letter
                const dayLetter = dateObj.toLocaleDateString('en-US', { weekday: 'narrow', timeZone: 'UTC' });
                const dayNumber = dateObj.getDate(); // UTC day if the string is YYYY-MM-DD
                const todayStr = new Date().toLocaleDateString('en-CA');
                const isToday = day.date === todayStr;

                return (
                    <div
                        key={day.date}
                        className={clsx(
                            "flex flex-col items-center justify-center gap-1 rounded-xl px-2.5 py-2 transition-all min-w-[3rem]",
                            isToday
                                ? "bg-white/20 ring-1 ring-white/50"
                                : "bg-white/5 opacity-80"
                        )}
                    >
                        <span className="text-[10px] font-medium uppercase opacity-70">
                            {dayLetter}
                        </span>
                        <div
                            className={clsx(
                                "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all",
                                day.isCompleted
                                    ? "bg-green-400 text-green-900 shadow-lg shadow-green-900/20"
                                    : day.hasTask
                                        ? "bg-white/10 text-white"
                                        : "bg-transparent text-white/50 border border-white/20"
                            )}
                        >
                            {day.isCompleted ? (
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            ) : (
                                dayNumber
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

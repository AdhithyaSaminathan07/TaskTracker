import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import WeeklyPlan from "@/models/WeeklyPlan";

function getWeekStartDate(date: Date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    const monday = new Date(d.setDate(diff));
    return monday.toLocaleDateString('en-CA');
}

export async function GET(request: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const email = searchParams.get("email");

        if (!email) {
            return NextResponse.json({ error: "Email required" }, { status: 400 });
        }

        const today = new Date();
        const weekStart = getWeekStartDate(today);

        const plan = await WeeklyPlan.findOne({ userEmail: email, weekStartDate: weekStart });

        if (!plan) {
            // Return empty structure if not found (or create? let's just return empty for frontend to handle)
            return NextResponse.json({ success: true, data: { goals: [] } });
        }

        return NextResponse.json({ success: true, data: plan });
    } catch (error) {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        await dbConnect();
        const { email, goals } = await request.json();

        const today = new Date();
        const weekStart = getWeekStartDate(today);

        const plan = await WeeklyPlan.findOneAndUpdate(
            { userEmail: email, weekStartDate: weekStart },
            {
                userEmail: email,
                weekStartDate: weekStart,
                goals: goals
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        return NextResponse.json({ success: true, data: plan });
    } catch (error) {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

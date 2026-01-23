import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import WeeklyPlan from "@/models/WeeklyPlan";
import mongoose from "mongoose";

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
        const userEmail = request.headers.get("x-user-email");
        const userId = request.headers.get("x-user-id");

        if (!userEmail || !userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
        }

        const today = new Date();
        const weekStart = getWeekStartDate(today);

        const plan = await WeeklyPlan.findOne({ 
            userId: new mongoose.Types.ObjectId(userId), 
            weekStartDate: weekStart 
        });

        if (!plan) {
            // Return empty structure if not found (or create? let's just return empty for frontend to handle)
            return NextResponse.json({ success: true, data: { goals: [] } });
        }

        return NextResponse.json({ success: true, data: plan });
    } catch (error) {
        console.error("Error in GET /api/plans:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        await dbConnect();
        const userEmail = request.headers.get("x-user-email");
        const userId = request.headers.get("x-user-id");

        if (!userEmail || !userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
        }

        const { goals } = await request.json();

        const today = new Date();
        const weekStart = getWeekStartDate(today);

        const userIdObjectId = new mongoose.Types.ObjectId(userId);

        const plan = await WeeklyPlan.findOneAndUpdate(
            { userId: userIdObjectId, weekStartDate: weekStart },
            {
                userEmail,
                userId: userIdObjectId,
                weekStartDate: weekStart,
                goals: goals || []
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        return NextResponse.json({ success: true, data: plan });
    } catch (error) {
        console.error("Error in PUT /api/plans:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Focus from "@/models/Focus";

export async function GET(request: Request) {
    try {
        await dbConnect();
        const userEmail = request.headers.get("x-user-email");
        const userId = request.headers.get("x-user-id");

        if (!userEmail || !userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Generate dates for the last 7 days
        const dates = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            dates.push(d.toLocaleDateString('en-CA'));
        }

        const tasks = await Focus.find({
            userId,
            date: { $in: dates }
        });

        // Map tasks to dates to easy lookup
        const taskMap = new Map();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        tasks.forEach((t: any) => taskMap.set(t.date, t));

        const weekData = dates.map(date => ({
            date,
            isCompleted: taskMap.has(date) ? taskMap.get(date).isCompleted : false,
            hasTask: taskMap.has(date)
        }));

        return NextResponse.json({ success: true, data: weekData });
    } catch (error) {
        console.error("Error in GET /api/focus/week:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

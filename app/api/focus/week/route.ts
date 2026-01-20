import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Focus from "@/models/Focus";

export async function GET(request: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const email = searchParams.get("email");

        if (!email) {
            return NextResponse.json({ error: "Email required" }, { status: 400 });
        }

        // Generate dates for the last 7 days
        const dates = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            dates.push(d.toLocaleDateString('en-CA'));
        }

        const tasks = await Focus.find({
            email,
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
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

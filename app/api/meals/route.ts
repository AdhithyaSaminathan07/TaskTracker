import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Meal from "@/models/Meal";

export async function POST(request: Request) {
    try {
        await dbConnect();

        // Auth check (using headers passed from frontend/middleware simulation)
        const userId = request.headers.get("x-user-id");
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();

        const meal = await Meal.create({
            ...body,
            userId,
        });

        return NextResponse.json({ success: true, data: meal }, { status: 201 });
    } catch (error) {
        console.error("Error creating meal:", error);
        return NextResponse.json({ error: "Failed to create meal" }, { status: 500 });
    }
}

export async function GET(request: Request) {
    try {
        await dbConnect();

        const userId = request.headers.get("x-user-id");
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const dateStr = searchParams.get("date");

        let query: any = { userId };

        if (dateStr) {
            const startOfDay = new Date(dateStr);
            startOfDay.setHours(0, 0, 0, 0);

            const endOfDay = new Date(dateStr);
            endOfDay.setHours(23, 59, 59, 999);

            query.date = {
                $gte: startOfDay,
                $lte: endOfDay
            };
        }

        const meals = await Meal.find(query).sort({ date: -1 });

        return NextResponse.json({ success: true, data: meals }, { status: 200 });
    } catch (error) {
        console.error("Error fetching meals:", error);
        return NextResponse.json({ error: "Failed to fetch meals" }, { status: 500 });
    }
}

import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export async function GET(request: Request) {
    try {
        await dbConnect();

        const userId = request.headers.get("x-user-id");
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await User.findById(userId).select("calorieTarget");
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, target: user.calorieTarget || 2000 });
    } catch (error) {
        console.error("Error fetching target:", error);
        return NextResponse.json({ error: "Failed to fetch target" }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        await dbConnect();

        const userId = request.headers.get("x-user-id");
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { target } = await request.json();

        const user = await User.findByIdAndUpdate(
            userId,
            { calorieTarget: target },
            { new: true }
        );

        return NextResponse.json({ success: true, target: user.calorieTarget });
    } catch (error) {
        console.error("Error updating target:", error);
        return NextResponse.json({ error: "Failed to update target" }, { status: 500 });
    }
}

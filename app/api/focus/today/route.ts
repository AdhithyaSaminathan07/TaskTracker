import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Focus from "@/models/Focus";
import mongoose from "mongoose";

// In a real app, you'd get the user email from the session/token.
// For now, we'll accept it in the request or headers, OR assume a demo user.
// To keep it simple but functional, let's look for a custom header 'x-user-email'
// or just return the latest task if no specific user handling is strictly enforced yet without auth context.
// BUT, since we have auth pages, we should try to use it. 
// Given the constraints, I will assume the client sends the email.

export async function GET(request: Request) {
    try {
        await dbConnect();
        const userEmail = request.headers.get("x-user-email");
        const userId = request.headers.get("x-user-id");

        if (!userEmail || !userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const today = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD

        const focus = await Focus.findOne({ userId: new mongoose.Types.ObjectId(userId), date: today });

        return NextResponse.json({ success: true, data: focus });
    } catch (error) {
        console.error("Error in GET /api/focus/today:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await dbConnect();
        const userEmail = request.headers.get("x-user-email");
        const userId = request.headers.get("x-user-id");

        if (!userEmail || !userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { title } = await request.json();
        const today = new Date().toLocaleDateString('en-CA');

        // Upsert: Create if not exists, otherwise update
        const focus = await Focus.findOneAndUpdate(
            { userId: new mongoose.Types.ObjectId(userId), date: today },
            {
                userEmail,
                userId: new mongoose.Types.ObjectId(userId),
                date: today,
                mainFocus: title,
                // isCompleted default false
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        return NextResponse.json({ success: true, data: focus });
    } catch (error) {
        console.error("Error in POST /api/focus/today:", error);
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

        const {
            isCompleted, notes, reflection,
            modSystemBoot, modPlanning, modDeepWork, modDebugging,
            modLearning, modHygiene, modAdmin, modShutdown,
            customTasks
        } = await request.json();
        const today = new Date().toLocaleDateString('en-CA');

        const updateData: Record<string, unknown> = {};

        if (typeof isCompleted !== 'undefined') updateData.isCompleted = isCompleted;
        if (typeof notes !== 'undefined') updateData.notes = notes;
        if (typeof reflection !== 'undefined') updateData.reflection = reflection;

        if (typeof modSystemBoot !== 'undefined') updateData.modSystemBoot = modSystemBoot;
        if (typeof modPlanning !== 'undefined') updateData.modPlanning = modPlanning;
        if (typeof modDeepWork !== 'undefined') updateData.modDeepWork = modDeepWork;
        if (typeof modDebugging !== 'undefined') updateData.modDebugging = modDebugging;
        if (typeof modLearning !== 'undefined') updateData.modLearning = modLearning;
        if (typeof modHygiene !== 'undefined') updateData.modHygiene = modHygiene;
        if (typeof modAdmin !== 'undefined') updateData.modAdmin = modAdmin;
        if (typeof modShutdown !== 'undefined') updateData.modShutdown = modShutdown;

        if (typeof customTasks !== 'undefined') updateData.customTasks = customTasks;

        // Ensure these are present for upsert
        updateData.userEmail = userEmail;
        updateData.userId = new mongoose.Types.ObjectId(userId);
        updateData.date = today;

        const focus = await Focus.findOneAndUpdate(
            { userId: new mongoose.Types.ObjectId(userId), date: today },
            updateData,
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        return NextResponse.json({ success: true, data: focus });
    } catch (error) {
        console.error("Error in PUT /api/focus/today:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

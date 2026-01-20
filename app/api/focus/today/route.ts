import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Focus from "@/models/Focus";

// In a real app, you'd get the user email from the session/token.
// For now, we'll accept it in the request or headers, OR assume a demo user.
// To keep it simple but functional, let's look for a custom header 'x-user-email'
// or just return the latest task if no specific user handling is strictly enforced yet without auth context.
// BUT, since we have auth pages, we should try to use it. 
// Given the constraints, I will assume the client sends the email.

export async function GET(request: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const email = searchParams.get("email");
        const today = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD

        if (!email) {
            return NextResponse.json({ error: "Email required" }, { status: 400 });
        }

        const focus = await Focus.findOne({ userEmail: email, date: today });

        return NextResponse.json({ success: true, data: focus });
    } catch (error) {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await dbConnect();
        const { email, title } = await request.json();
        const today = new Date().toLocaleDateString('en-CA');

        // Upsert: Create if not exists, otherwise update
        const focus = await Focus.findOneAndUpdate(
            { userEmail: email, date: today },
            {
                userEmail: email,
                date: today,
                mainFocus: title,
                // isCompleted default false
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        return NextResponse.json({ success: true, data: focus });
    } catch (error) {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        await dbConnect();
        const {
            email, isCompleted, notes, reflection,
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
        updateData.userEmail = email;
        updateData.date = today;

        const focus = await Focus.findOneAndUpdate(
            { userEmail: email, date: today },
            updateData,
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        return NextResponse.json({ success: true, data: focus });
    } catch (error) {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

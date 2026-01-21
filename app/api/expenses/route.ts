import { NextResponse } from "next/server";
// import { getServerSession } from "next-auth"; // Auth not yet installed
import dbConnect from "@/lib/db";
import Expense from "@/models/Expense";

export async function POST(req: Request) {
    try {
        const userEmail = req.headers.get("x-user-email");
        const userId = req.headers.get("x-user-id");

        if (!userEmail || !userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const data = await req.json();

        const expense = await Expense.create({
            userEmail: userEmail,
            userId: userId,
            amount: data.amount,
            category: data.category,
            description: data.description,
            timestamp: new Date(),
        });

        return NextResponse.json(expense);
    } catch (error) {
        console.error("Error creating expense:", error);
        return NextResponse.json({ error: "Error creating expense" }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const userEmail = req.headers.get("x-user-email");
        const userId = req.headers.get("x-user-id");

        if (!userEmail || !userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        // Fetch recent expenses (last 50)
        const expenses = await Expense.find({ userId })
            .sort({ timestamp: -1 })
            .limit(50);

        return NextResponse.json(expenses);
    } catch (error) {
        console.error("Error fetching expenses:", error);
        return NextResponse.json({ error: "Error fetching expenses" }, { status: 500 });
    }
}

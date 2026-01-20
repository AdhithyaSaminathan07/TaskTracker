import { NextResponse } from "next/server";
// import { getServerSession } from "next-auth"; // Auth not yet installed
import dbConnect from "@/lib/db";
import Expense from "@/models/Expense";

export async function POST(req: Request) {
    try {
        // const session = await getServerSession();
        // if (!session || !session.user?.email) {
        //     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        // }
        const userEmail = "demo@example.com"; // Temporary mock user

        await dbConnect();
        const data = await req.json();

        const expense = await Expense.create({
            userEmail: userEmail,
            amount: data.amount,
            category: data.category,
            description: data.description,
            timestamp: new Date(),
        });

        return NextResponse.json(expense);
    } catch (error) {
        return NextResponse.json({ error: "Error creating expense" }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        // const session = await getServerSession();
        const userEmail = "demo@example.com";
        // if (!session || !session.user?.email) {
        //     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        // }

        await dbConnect();

        // Fetch recent expenses (last 50)
        const expenses = await Expense.find({ userEmail })
            .sort({ timestamp: -1 })
            .limit(50);

        return NextResponse.json(expenses);
    } catch (error) {
        return NextResponse.json({ error: "Error fetching expenses" }, { status: 500 });
    }
}

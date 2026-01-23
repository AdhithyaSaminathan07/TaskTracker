import { NextResponse } from "next/server";
// import { getServerSession } from "next-auth"; // Auth not yet installed
import dbConnect from "@/lib/db";
import Expense from "@/models/Expense";
import mongoose from "mongoose";
import fs from 'fs';
import path from 'path';

function logToFile(message: string) {
    try {
        const logPath = path.resolve(process.cwd(), 'debug_focus.log');
        const timestamp = new Date().toISOString();
        fs.appendFileSync(logPath, `[${timestamp}] ${message}\n`);
    } catch (e) {
        // ignore
    }
}

export async function POST(req: Request) {
    try {
        const userEmail = req.headers.get("x-user-email");
        const userId = req.headers.get("x-user-id");

        if (!userEmail || !userId) {
            logToFile(`[Expenses POST] Unauthorized: Email=${userEmail}, ID=${userId}`);
            return NextResponse.json({ error: "Unauthorized: Missing headers" }, { status: 401 });
        }

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            logToFile(`[Expenses POST] Invalid User ID: ${userId}`);
            return NextResponse.json({ error: "Invalid User ID format" }, { status: 400 });
        }

        await dbConnect();
        const data = await req.json();

        // Basic validation
        if (!data.amount || !data.category) {
            return NextResponse.json({ error: "Amount and category are required" }, { status: 400 });
        }

        const expense = await Expense.create({
            userEmail: userEmail,
            userId: new mongoose.Types.ObjectId(userId),
            amount: data.amount,
            category: data.category,
            description: data.description,
            timestamp: new Date(),
        });

        return NextResponse.json(expense);
    } catch (error: any) {
        console.error("Error creating expense:", error);
        logToFile(`[Expenses POST] Error: ${error.message}`);
        return NextResponse.json({ error: `Error creating expense: ${error.message}` }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const userEmail = req.headers.get("x-user-email");
        const userId = req.headers.get("x-user-id");

        if (!userEmail || !userId) {
            logToFile(`[Expenses GET] Unauthorized: Email=${userEmail}, ID=${userId}`);
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        logToFile(`[Expenses GET] Fetching for UserID: ${userId}`);

        // Fetch recent expenses (last 50)
        const expenses = await Expense.find({ userId: new mongoose.Types.ObjectId(userId) })
            .sort({ timestamp: -1 })
            .limit(50);

        logToFile(`[Expenses GET] Found ${expenses.length} expenses`);

        return NextResponse.json(expenses);
    } catch (error: any) {
        console.error("Error fetching expenses:", error);
        logToFile(`[Expenses GET] Error: ${error.message}`);
        return NextResponse.json({ error: "Error fetching expenses" }, { status: 500 });
    }
}

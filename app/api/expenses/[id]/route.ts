import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Expense from "@/models/Expense";
import mongoose from "mongoose";

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const userEmail = req.headers.get("x-user-email");
        const userId = req.headers.get("x-user-id");

        if (!userEmail || !userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const { id } = await params;
        const deleted = await Expense.findOneAndDelete({
            _id: id,
            userId: new mongoose.Types.ObjectId(userId),
        });

        if (!deleted) {
            return NextResponse.json({ error: "Expense not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting expense:", error);
        return NextResponse.json({ error: "Error deleting expense" }, { status: 500 });
    }
}

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const userEmail = req.headers.get("x-user-email");
        const userId = req.headers.get("x-user-id");

        if (!userEmail || !userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const { id } = await params;
        const data = await req.json();

        // Update the expense
        const updated = await Expense.findOneAndUpdate(
            { _id: id, userId: new mongoose.Types.ObjectId(userId) },
            {
                amount: data.amount,
                category: data.category,
                description: data.description,
            },
            { new: true }
        );

        if (!updated) {
            return NextResponse.json({ error: "Expense not found" }, { status: 404 });
        }

        return NextResponse.json(updated);
    } catch (error) {
        console.error("Error updating expense:", error);
        return NextResponse.json({ error: "Error updating expense" }, { status: 500 });
    }
}

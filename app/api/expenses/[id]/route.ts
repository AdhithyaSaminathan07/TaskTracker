import { NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
import dbConnect from "@/lib/db";
import Expense from "@/models/Expense";

// Mock user for now
const userEmail = "demo@example.com";

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await params;
        const deleted = await Expense.findOneAndDelete({
            _id: id,
            userEmail,
        });

        if (!deleted) {
            return NextResponse.json({ error: "Expense not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Error deleting expense" }, { status: 500 });
    }
}

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await params;
        const data = await req.json();

        // Update the expense
        const updated = await Expense.findOneAndUpdate(
            { _id: id, userEmail },
            {
                amount: data.amount,
                category: data.category,
                description: data.description,
                timestamp: new Date() // Optionally update time, or keep original? user usually expects "edit" to reflected content, maybe not time. 
                // Let's NOT update timestamp to keep history accurate, or maybe update it? 
                // Usually editing a transaction fixes a mistake, so date might remain same. 
                // But for simplicity let's just update content fields.
            },
            { new: true }
        );

        if (!updated) {
            return NextResponse.json({ error: "Expense not found" }, { status: 404 });
        }

        return NextResponse.json(updated);
    } catch (error) {
        return NextResponse.json({ error: "Error updating expense" }, { status: 500 });
    }
}

import { NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
import dbConnect from "@/lib/db";
import Expense from "@/models/Expense";

export async function GET(req: Request) {
    try {
        // const session = await getServerSession();
        const userEmail = "demo@example.com";
        // if (!session || !session.user?.email) {
        //     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        // }

        await dbConnect();
        const now = new Date();

        // Today
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        // This Week (Start from Sunday or Monday? Let's assume Sunday)
        const day = now.getDay();
        const diff = now.getDate() - day; // adjust when day is sunday
        const weekStart = new Date(now.setDate(diff));
        weekStart.setHours(0, 0, 0, 0);

        // Reset now for month calc
        const nowForMonth = new Date();
        // This Month
        const monthStart = new Date(nowForMonth.getFullYear(), nowForMonth.getMonth(), 1);

        const stats = await Expense.aggregate([
            { $match: { userEmail } },
            {
                $facet: {
                    today: [
                        { $match: { timestamp: { $gte: todayStart } } },
                        { $group: { _id: null, total: { $sum: "$amount" } } }
                    ],
                    week: [
                        { $match: { timestamp: { $gte: weekStart } } },
                        { $group: { _id: null, total: { $sum: "$amount" } } }
                    ],
                    month: [
                        { $match: { timestamp: { $gte: monthStart } } },
                        { $group: { _id: null, total: { $sum: "$amount" } } }
                    ]
                }
            }
        ]);

        const result = stats[0];

        return NextResponse.json({
            today: result.today[0]?.total || 0,
            week: result.week[0]?.total || 0,
            month: result.month[0]?.total || 0
        });
    } catch (error) {
        return NextResponse.json({ error: "Error fetching stats" }, { status: 500 });
    }
}

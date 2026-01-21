import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export async function POST(request: Request) {
    try {
        await dbConnect();
        const { email, password } = await request.json();

        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json(
                { error: "Invalid credentials" },
                { status: 400 }
            );
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return NextResponse.json(
                { error: "Invalid credentials" },
                { status: 400 }
            );
        }

        // In a real app, you would set a session cookie or return a JWT here.
        // For this simple example, we just return success.
        return NextResponse.json({
            success: true,
            data: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        }, { status: 200 });
    } catch (error) {
        console.error("Login Check Error:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

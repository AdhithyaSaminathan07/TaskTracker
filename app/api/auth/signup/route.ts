import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db";
import User from "@/models/User";

import mongoose from "mongoose";

export async function POST(request: Request) {
    try {
        await dbConnect();
        const { name, email, password } = await request.json();

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return NextResponse.json(
                { error: "User already exists" },
                { status: 400 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const userId = new mongoose.Types.ObjectId();

        const user = await User.create({
            _id: userId,
            name,
            email,
            password: hashedPassword,
        });

        return NextResponse.json({ success: true, data: user }, { status: 201 });
    } catch (error) {
        console.error("Signup Error:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

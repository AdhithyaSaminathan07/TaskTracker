import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import fs from 'fs';
import path from 'path';

function logToFile(message: string) {
    try {
        const logPath = path.resolve(process.cwd(), 'debug_focus.log');
        const timestamp = new Date().toISOString();
        fs.appendFileSync(logPath, `[${timestamp}] [LOGIN] ${message}\n`);
    } catch (e) {
        // ignore
    }
}

export async function POST(request: Request) {
    try {
        await dbConnect();
        const { email, password } = await request.json();
        logToFile(`Attempt for email: ${email}`);

        const user = await User.findOne({ email });

        if (!user) {
            logToFile(`User not found: ${email}`);
            return NextResponse.json(
                { error: "Invalid credentials" },
                { status: 400 }
            );
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            logToFile(`Password mismatch for: ${email}`);
            return NextResponse.json(
                { error: "Invalid credentials" },
                { status: 400 }
            );
        }

        logToFile(`Login successful for: ${email}. Payload: ${JSON.stringify({ id: user._id.toString(), name: user.name, email: user.email })}`);

        // In a real app, you would set a session cookie or return a JWT here.
        // For this simple example, we just return success.
        return NextResponse.json({
            success: true,
            data: {
                id: user._id.toString(),
                name: user.name,
                email: user.email
            }
        }, { status: 200 });
    } catch (error) {
        console.error("Login Check Error:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

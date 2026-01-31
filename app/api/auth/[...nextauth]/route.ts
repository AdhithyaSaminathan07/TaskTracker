import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import dbConnect from "@/lib/db";
import User from "@/models/User";

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            httpOptions: {
                timeout: 10000,
            },
        }),
    ],
    callbacks: {
        async signIn({ user, account }) {
            if (account?.provider === "google") {
                await dbConnect();
                try {
                    const existingUser = await User.findOne({ email: user.email });
                    if (!existingUser) {
                        await User.create({
                            name: user.name,
                            email: user.email,
                            // No password needed for OAuth users
                        });
                    }
                    return true;
                } catch (error) {
                    console.error("Error saving user", error);
                    return false;
                }
            }
            return true;
        },
        async session({ session }) {
            if (session.user) {
                await dbConnect();
                // Fetch the user from DB to get the actual _id
                const dbUser = await User.findOne({ email: session.user.email });
                if (dbUser) {
                    // @ts-ignore
                    session.user.id = dbUser._id.toString();
                    // @ts-ignore
                    session.user.name = dbUser.name;
                }
            }
            return session;
        },
    },
    pages: {
        signIn: '/',
    },
    secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };

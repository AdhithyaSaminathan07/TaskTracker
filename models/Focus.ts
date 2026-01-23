import mongoose, { Document } from "mongoose";

export interface IFocus extends Document {
    userEmail: string;
    organizationId: string;
    date: string; // YYYY-MM-DD
    mainFocus: string;
    isCompleted: boolean;

    // Developer Protocol Modules
    modSystemBoot: boolean;
    modPlanning: boolean;
    modDeepWork: boolean;
    modDebugging: boolean;
    modLearning: boolean;
    modHygiene: boolean;
    modAdmin: boolean;
    modShutdown: boolean;

    // Custom Tasks
    customTasks: { id: string; title: string; isCompleted: boolean; time?: string; category?: string }[];

    notes: string;
    reflection: string;
    createdAt: Date;
    updatedAt: Date;
}

const FocusSchema = new mongoose.Schema(
    {
        userEmail: { type: String, required: true },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        date: { type: String, required: true },
        mainFocus: { type: String, default: "" },
        isCompleted: { type: Boolean, default: false },

        // Protocol Modules
        modSystemBoot: { type: Boolean, default: false },
        modPlanning: { type: Boolean, default: false },
        modDeepWork: { type: Boolean, default: false },
        modDebugging: { type: Boolean, default: false },
        modLearning: { type: Boolean, default: false },
        modHygiene: { type: Boolean, default: false },
        modAdmin: { type: Boolean, default: false },
        modShutdown: { type: Boolean, default: false },

        // Custom Tasks
        customTasks: [{
            id: { type: String }, // simple random ID
            title: { type: String },
            isCompleted: { type: Boolean, default: false },
            time: { type: String }, // e.g. "10:00", "14:30"
            category: { type: String } // "Morning", "Night", "Goal"
        }],

        notes: { type: String, default: "" },
        reflection: { type: String, default: "" },
    },
    { timestamps: true }
);

// Composite index to ensure one focus task per user per day
// Use userId + date to match all API queries/upserts.
FocusSchema.index({ userId: 1, date: 1 }, { unique: true });

export default mongoose.models.Focus || mongoose.model<IFocus>("Focus", FocusSchema);

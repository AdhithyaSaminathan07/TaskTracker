import mongoose, { Document } from "mongoose";

export interface IWeeklyPlan extends Document {
    userEmail: string;
    organizationId: string;
    weekStartDate: string; // YYYY-MM-DD of the Monday of the week
    summary: string;
    goals: {
        id: string;
        title: string;
        description?: string;
        startTime?: string;
        endTime?: string;
        date?: string;
        color?: string;
        category?: string;
        isCompleted: boolean;
    }[];
    createdAt: Date;
    updatedAt: Date;
}

const WeeklyPlanSchema = new mongoose.Schema(
    {
        userEmail: { type: String, required: true },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        weekStartDate: { type: String, required: true },
        summary: { type: String, default: "" },
        goals: [{
            id: { type: String },
            title: { type: String },
            description: { type: String, default: "" },
            startTime: { type: String }, // e.g., "12:00 PM"
            endTime: { type: String },
            date: { type: String }, // YYYY-MM-DD
            color: { type: String, default: "blue" }, // pink, purple, yellow, green
            category: { type: String },
            isCompleted: { type: Boolean, default: false }
        }]
    },
    { timestamps: true }
);

// Composite unique index
WeeklyPlanSchema.index({ userEmail: 1, weekStartDate: 1 }, { unique: true });

// Delete existing model to prevent OverwriteModelError/stale schema in dev
if (mongoose.models.WeeklyPlan) {
    delete mongoose.models.WeeklyPlan;
}

const WeeklyPlan = mongoose.model<IWeeklyPlan>("WeeklyPlan", WeeklyPlanSchema);
export default WeeklyPlan;

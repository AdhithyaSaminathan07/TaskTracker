import mongoose, { Document } from "mongoose";

export interface IWeeklyPlan extends Document {
    userEmail: string;
    organizationId: string;
    weekStartDate: string; // YYYY-MM-DD of the Monday of the week
    goals: { id: string; title: string; isCompleted: boolean }[];
    createdAt: Date;
    updatedAt: Date;
}

const WeeklyPlanSchema = new mongoose.Schema(
    {
        userEmail: { type: String, required: true },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        weekStartDate: { type: String, required: true },
        goals: [{
            id: { type: String },
            title: { type: String },
            isCompleted: { type: Boolean, default: false }
        }]
    },
    { timestamps: true }
);

// Composite unique index
WeeklyPlanSchema.index({ userEmail: 1, weekStartDate: 1 }, { unique: true });

export default mongoose.models.WeeklyPlan || mongoose.model<IWeeklyPlan>("WeeklyPlan", WeeklyPlanSchema);

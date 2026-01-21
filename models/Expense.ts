import mongoose from "mongoose";

const ExpenseSchema = new mongoose.Schema({
    userEmail: {
        type: String,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.models.Expense || mongoose.model("Expense", ExpenseSchema);

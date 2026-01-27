import mongoose from "mongoose";

const MealSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    name: {
        type: String,
        required: [true, "Please provide a name for this meal."],
    },
    calories: {
        type: Number,
        required: [true, "Please provide calorie count."],
        default: 0,
    },
    protein: {
        type: Number,
        default: 0,
    },
    carbs: {
        type: Number,
        default: 0,
    },
    fats: {
        type: Number,
        default: 0,
    },
    fiber: {
        type: Number,
        default: 0,
    },
    date: {
        type: Date,
        default: Date.now,
        required: true,
    },
    type: {
        type: String,
        enum: ["Breakfast", "Lunch", "Dinner", "Snack"],
        default: "Snack",
    },
}, { timestamps: true });

export default mongoose.models.Meal || mongoose.model("Meal", MealSchema);

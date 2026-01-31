import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Please provide an email for this user."],
        unique: true,
    },
    password: {
        type: String,
        required: false,
    },
    name: {
        type: String,
        required: [true, "Please provide a name for this user."],
    },
    calorieTarget: {
        type: Number,
        default: 2000,
    },
});

export default mongoose.models.User || mongoose.model("User", UserSchema);

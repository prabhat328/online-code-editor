import mongoose from "mongoose";

const authSchema = mongoose.Schema(
    {
        "email": { type: String, required: true, unique: true },
        "password": { type: String, required: true },
    },
    { timestamps: true }
);

export default mongoose.model('Auth', authSchema, 'auth');

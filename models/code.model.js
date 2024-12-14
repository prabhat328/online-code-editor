import mongoose from "mongoose";

const codeSchema = mongoose.Schema(
    {
        name: { type: String, required: true },
        language: { type: String, required: true },
        code: { type: String, required: true },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Auth', required: true },
    },
    { timestamps: true }
);

export default mongoose.model('Code', codeSchema, 'codes');

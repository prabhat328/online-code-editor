import mongoose from "mongoose";

const authSchema = mongoose.Schema({
    "email": { type: String, required: true, unique: true },
    "password": { type: String, minLength: 6, maxLength: 18, required: true },
});

export default mongoose.model('Auth', authSchema, 'auth');

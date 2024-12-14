import Code from "../models/code.model.js";
import mongoose from "mongoose";
// Save or Update Code Controller
export const saveCode = async (req, res) => {
    const { name, language, code } = req.body;

    try {
        // Check if a code snippet with the same name exists for the user
        const existingCode = await Code.findOne({ name, userId: req.user.userId });
        if (existingCode) {
            existingCode.language = language;
            existingCode.code = code;
            await existingCode.save();

            return res.status(200).json({ message: "Code updated successfully", code: existingCode });
        }

        const newCode = new Code({ name, language, code, userId: req.user.userId });
        await newCode.save();

        return res.status(201).json({ message: "Code saved successfully", code: newCode });
    } catch (error) {
        console.error("Save Code Error:", error);

        if (error.name === "ValidationError") {
            return res.status(400).json({
                message: "Invalid input",
                errors: Object.keys(error.errors).map(field => ({
                    field,
                    error: error.errors[field].message
                }))
            });
        }
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Get All Saved Codes (Names Only)
export const getAllSaves = async (req, res) => {
    try {
        const codes = await Code.find({ userId: req.user.userId }).select("name");

        return res.status(200).json({ codes });
    } catch (error) {
        console.error("Get All Saves Error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Get a Specific Code by ID
export const getCode = async (req, res) => {
    const { codeId } = req.params;

    // Check if codeId is a valid mongodb Object Id
    if (!mongoose.isValidObjectId(codeId)) {
        return res.status(400).json({ message: "The code Id is invalid" });
    }

    try {
        const code = await Code.findOne({ _id: codeId, userId: req.user.userId });
        if (!code) {
            return res.status(404).json({ message: "Code not found" });
        }

        return res.status(200).json({ code });
    } catch (error) {
        console.error("Get Code Error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

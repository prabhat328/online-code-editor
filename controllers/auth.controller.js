import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Auth from "../models/auth.model.js";
import { configDotenv } from "dotenv";

configDotenv();

// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET;

// Login function
export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Search user with email
        const user = await Auth.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "Email not found" });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid password" });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });

        // Set token as an HttpOnly cookie
        res.cookie("authToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            maxAge: 3600000,
        });

        return res.status(200).json({ message: "Login successful" });
    } catch (error) {
        console.error("Error during login:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Register function
export const register = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (password.length < 6 || password.length > 18) {
            return res.status(400).json({ message: "Password length too short or large." });
        }
        // Check if the email is already in use
        const existingUser = await Auth.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already in use" });
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new Auth({ email, password: hashedPassword });
        await newUser.save();

        // Generate JWT token
        const token = jwt.sign({ userId: newUser._id, email: newUser.email }, JWT_SECRET, { expiresIn: "1h" });

        // Set the token in an HTTP-only cookie
        res.cookie("authToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            maxAge: 3600000,
        });

        return res.status(201).json({ message: "User registered successfully", token: token });
    } catch (error) {
        console.error("Error during registration:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const logout = (req, res) => {
    res.clearCookie("authToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
    });

    return res.status(200).json({ message: "Logout successful" });
};
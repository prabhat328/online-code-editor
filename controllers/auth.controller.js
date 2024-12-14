import bcrypt from "bcryptjs";
import Auth from "../models/auth.model";

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

        return res.status(200).json({ message: "Login successful", userId: user._id });
    } catch (error) {
        console.error("Error during login:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Register function
export const register = async (req, res) => {
    const { email, password } = req.body;

    try {
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

        return res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Error during registration:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

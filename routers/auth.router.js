import express from "express";
import { login, register,logout } from "../controllers/auth.controller.js";

const router = express.Router();

// Login router
router.post('/login', login);
// Registration router
router.post('/register', register);
// Logout route
router.post('/logout', logout);

export default router;
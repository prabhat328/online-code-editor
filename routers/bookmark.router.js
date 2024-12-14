import express from "express";
import { saveCode, getAllSaves, getCode } from "../controllers/bookmark.controller.js";
import { authenticateToken } from "../middlewares/auth.middleware.js"

const router = express.Router();

// Save code or update if already exist
router.post('/code', authenticateToken, saveCode);

// Get names of all the saved code
router.get('/codes', authenticateToken, getAllSaves);

// Get a specific code
router.get('/codes/:codeId', authenticateToken, getCode);

export default router;

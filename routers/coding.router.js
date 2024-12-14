import express from "express";
import { runCode } from "../controllers/coding.controller.js";

const router = express.Router();

// Run a code
router.post('/execute', runCode );

export default router;
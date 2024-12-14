import express from "express";
import cors from "cors";
import { configDotenv } from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

import authRouter from "./routers/auth.router.js";
import bookmarkRouter from "./routers/bookmark.router.js";
import codingRouter from "./routers/coding.router.js";

configDotenv();

const app = express();
const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;

app.use(cors('*'));
app.use(cookieParser());
app.use(express.json());

app.get('/', (req, res) => res.json({ status: "Running" }));
app.use('/auth', authRouter);
app.use('/', bookmarkRouter);
app.use('/', codingRouter);

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log("Connected to DataBase");
        app.listen(PORT, () => { console.log(`Server listening on port ${PORT}`); });
    })
    .catch(() => {
        console.log("Cannot connect to database");
        return;
    });
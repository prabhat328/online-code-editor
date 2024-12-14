import express from "express";
import cors from "cors";
import { configDotenv } from "dotenv";
import mongoose from "mongoose";

import authRouter from "./routers/auth.router.js";

configDotenv();

const app = express();
const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;

app.use(cors('*'));

app.get('/', (req, res) => res.json({ status: "Running" }));
app.use('/auth', authRouter);

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log("Connected to DataBase");
        app.listen(PORT, () => { console.log(`Server listening on port ${PORT}`); });
    })
    .catch(() => {
        console.log("Cannot connect to database");
        return;
    });
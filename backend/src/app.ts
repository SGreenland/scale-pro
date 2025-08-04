// src/app.ts
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Stripe from "stripe";

import authRoutes from "./routes/auth";
import settingsRoutes from "./routes/settings";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Register routes here
app.use("/api", authRoutes);

app.use("/api", settingsRoutes)

export default app;

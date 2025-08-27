// src/app.ts
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Stripe from "stripe";
import authRoutes from "./routes/auth";
import settingsRoutes from "./routes/settings";
import stripeRoutes from "./routes/stripe";
import userRoutes from "./routes/user";
import pitchDataRoutes from "./routes/pitchData";
import { stripeWebhook } from "./controllers/stripeController";

dotenv.config();

var cookieParser = require('cookie-parser');

const app = express();

app.use(cors());
app.post('/api/webhook',express.raw({ type: 'application/json' }), stripeWebhook);
app.use(express.json());
app.use(cookieParser());

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);


// Register routes here
app.use("/api", authRoutes);
app.use("/api", settingsRoutes);
app.use("/api", userRoutes);
app.use("/api", pitchDataRoutes);
app.use("/api/stripe", stripeRoutes);



export default app;

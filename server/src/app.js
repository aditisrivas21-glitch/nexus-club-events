import express from "express";
import cors from "cors";
import helmet from "helmet";
import mongoose from "mongoose";

import auth from "./routes/auth.js";
import events from "./routes/events.js";
import registrations from "./routes/registrations.js";

import { notFound, errorHandler } from "./middleware/index.js";

const app = express();

app.set("trust proxy", 1);

app.use(helmet());

// -----------------------------
// CORS CONFIGURATION
// -----------------------------

const allowedOrigins = [
  process.env.CLIENT_URL,
  "https://nexus-club-events1.vercel.app",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }

      if (
        origin.endsWith(".vercel.app") &&
        origin.includes("nexus-club-events1")
      ) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      callback(null, false);
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

// -----------------------------
// BODY PARSER
// -----------------------------

app.use(express.json({ limit: "50kb" }));

// -----------------------------
// HEALTH CHECK
// -----------------------------

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    db: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    uptime: Math.round(process.uptime()),
  });
});

// -----------------------------
// API ROUTES
// -----------------------------

app.use("/api/auth", auth);

app.use("/api/events", events);

app.use("/api/registrations", registrations);

// -----------------------------
// ERROR HANDLING
// -----------------------------

app.use(notFound);

app.use(errorHandler);

export default app;

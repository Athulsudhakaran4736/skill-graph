import express from "express";
import cors from "cors";
import helmet from "helmet";

import driver from "./config/database.js";

import skillRoutes from "./routes/skillRoutes.js";
import questionRoutes from "./routes/questionRoutes.js";
import assessmentRoutes from "./routes/assessmentRoutes.js";

import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    message: "SkillGraph API is running",
  });
});

app.get("/api/health", async (req, res) => {
  const session = driver.session();

  try {
    const result = await session.run("RETURN 1 AS value");

    const value = result.records[0].get("value");

    res.status(200).json({
      success: true,
      server: "healthy",
      database: "connected",
      result: typeof value.toNumber === "function" ? value.toNumber() : value,
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      server: "healthy",
      database: "unavailable",
    });
  } finally {
    await session.close();
  }
});

// API routes

app.use("/api/skills", skillRoutes);

app.use("/api/questions", questionRoutes);

app.use("/api/assessments", assessmentRoutes);

// 404

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found",
  });
});

// Error handler must stay last

app.use(errorHandler);

export default app;

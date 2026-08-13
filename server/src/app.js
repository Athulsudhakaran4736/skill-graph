import express from "express";
import cors from "cors";
import helmet from "helmet";
import driver from "./config/database.js";

const app = express();

app.use(helmet());

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
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
      result: value.toNumber ? value.toNumber() : value,
    });
  } catch (error) {
    console.error(error);

    res.status(503).json({
      success: false,
      server: "healthy",
      database: "unavailable",
      message: "Unable to connect to CognoDB",
    });
  } finally {
    await session.close();
  }
});

export default app;

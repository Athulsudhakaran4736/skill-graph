import dotenv from "dotenv";

dotenv.config();

import app from "./app.js";
import { verifyDatabaseConnection } from "./config/database.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  const databaseConnected = await verifyDatabaseConnection();

  if (!databaseConnected) {
    console.error("Server cannot start because CognoDB is unavailable");

    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`SkillGraph server running on port ${PORT}`);
  });
};

startServer();

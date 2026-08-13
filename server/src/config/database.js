import neo4j from "neo4j-driver";
import dotenv from "dotenv";

dotenv.config();

const { COGNODB_URI, COGNODB_USERNAME, COGNODB_PASSWORD } = process.env;

if (!COGNODB_URI || !COGNODB_USERNAME || !COGNODB_PASSWORD) {
  throw new Error("CognoDB environment variables are missing");
}

const driver = neo4j.driver(
  COGNODB_URI,
  neo4j.auth.basic(COGNODB_USERNAME, COGNODB_PASSWORD),
);

export const verifyDatabaseConnection = async () => {
  try {
    await driver.verifyConnectivity();

    console.log("CognoDB connected successfully");

    return true;
  } catch (error) {
    console.error("CognoDB connection failed:", error.message);

    return false;
  }
};

export default driver;

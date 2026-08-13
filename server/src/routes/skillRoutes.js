import express from "express";

import {
  fetchSkills,
  fetchSkillById,
  fetchSkillPrerequisites,
} from "../controllers/skillController.js";
import { fetchSkillGraph } from "../controllers/skillGraphController.js";

const router = express.Router();

router.get("/", fetchSkills);

router.get("/:skillId/prerequisites", fetchSkillPrerequisites);

router.get("/:skillId", fetchSkillById);

router.get("/:skillId/graph", fetchSkillGraph);
export default router;

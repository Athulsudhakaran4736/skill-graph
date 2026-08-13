import express from "express";

import {
  fetchSkills,
  fetchSkillById,
  fetchSkillPrerequisites,
} from "../controllers/skillController.js";

const router = express.Router();

router.get("/", fetchSkills);

router.get("/:skillId/prerequisites", fetchSkillPrerequisites);

router.get("/:skillId", fetchSkillById);

export default router;

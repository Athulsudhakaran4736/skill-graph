import express from "express";

import { fetchAssessmentQuestions } from "../controllers/questionController.js";

const router = express.Router();

router.get("/", fetchAssessmentQuestions);

export default router;

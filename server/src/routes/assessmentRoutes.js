import express from "express";

import { createAssessment } from "../controllers/assessmentController.js";

const router = express.Router();

router.post("/", createAssessment);

export default router;

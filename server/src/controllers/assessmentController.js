import { submitAssessment } from "../services/assessmentService.js";

export const createAssessment = async (req, res, next) => {
  try {
    const { candidateName, answers } = req.body;

    if (!candidateName || !candidateName.trim()) {
      return res.status(400).json({
        success: false,
        message: "Candidate name is required",
      });
    }

    if (!Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Assessment answers are required",
      });
    }

    const invalidAnswer = answers.some(
      (answer) => !answer.questionId || typeof answer.answer !== "string",
    );

    if (invalidAnswer) {
      return res.status(400).json({
        success: false,
        message: "Each answer must contain questionId and answer",
      });
    }

    const questionIds = answers.map((answer) => answer.questionId);

    const uniqueQuestionIds = new Set(questionIds);

    if (uniqueQuestionIds.size !== questionIds.length) {
      return res.status(400).json({
        success: false,
        message: "Duplicate question answers are not allowed",
      });
    }

    const result = await submitAssessment({
      candidateName: candidateName.trim(),

      answers,
    });

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

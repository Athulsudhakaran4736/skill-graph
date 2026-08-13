import { getAssessmentQuestions } from "../services/questionService.js";

export const fetchAssessmentQuestions = async (req, res, next) => {
  try {
    const questions = await getAssessmentQuestions();

    res.status(200).json({
      success: true,
      count: questions.length,
      data: questions,
    });
  } catch (error) {
    next(error);
  }
};

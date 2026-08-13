import driver from "../config/database.js";

import { GET_ASSESSMENT_QUESTIONS } from "../queries/questionQueries.js";

export const getAssessmentQuestions = async () => {
  const session = driver.session();

  try {
    const result = await session.run(GET_ASSESSMENT_QUESTIONS);

    const questions = result.records.map((record) => ({
      id: record.get("id"),
      text: record.get("text"),
      options: record.get("options"),
      difficulty: record.get("difficulty"),

      skill: {
        id: record.get("skillId"),
        name: record.get("skillName"),
      },
    }));

    // q1, q2, q3 ... instead of q1, q10, q11...
    questions.sort((a, b) => {
      const aNumber = Number(a.id.replace("q", ""));

      const bNumber = Number(b.id.replace("q", ""));

      return aNumber - bNumber;
    });

    return questions;
  } finally {
    await session.close();
  }
};

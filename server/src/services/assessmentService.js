import crypto from "crypto";

import driver from "../config/database.js";

import {
  GET_QUESTION_ANSWER_DATA,
  CREATE_CANDIDATE,
  CREATE_ANSWER_RELATIONSHIPS,
  CREATE_SKILL_SCORE_RELATIONSHIPS,
  GET_SKILL_GAPS,
} from "../queries/assessmentQueries.js";

const convertInteger = (value) => {
  if (
    value !== null &&
    value !== undefined &&
    typeof value.toNumber === "function"
  ) {
    return value.toNumber();
  }

  return value;
};

const calculateSkillScores = (processedAnswers) => {
  const skillMap = new Map();

  processedAnswers.forEach((answer) => {
    if (!skillMap.has(answer.skillId)) {
      skillMap.set(answer.skillId, {
        skillId: answer.skillId,
        skillName: answer.skillName,
        total: 0,
        correct: 0,
      });
    }

    const skill = skillMap.get(answer.skillId);

    skill.total += 1;

    if (answer.correct) {
      skill.correct += 1;
    }
  });

  return Array.from(skillMap.values()).map((skill) => ({
    ...skill,

    score: Math.round((skill.correct / skill.total) * 100),
  }));
};

const buildSkillGapResult = (records) => {
  const gaps = new Map();

  records.forEach((record) => {
    const weakSkillId = record.get("weakSkillId");

    if (!gaps.has(weakSkillId)) {
      gaps.set(weakSkillId, {
        id: weakSkillId,
        name: record.get("weakSkillName"),
        score: convertInteger(record.get("score")),
        impacts: [],
      });
    }

    const affectedSkillId = record.get("affectedSkillId");

    if (affectedSkillId) {
      const gap = gaps.get(weakSkillId);

      const alreadyAdded = gap.impacts.some(
        (item) => item.id === affectedSkillId,
      );

      if (!alreadyAdded) {
        gap.impacts.push({
          id: affectedSkillId,
          name: record.get("affectedSkillName"),
          distance: convertInteger(record.get("distance")),
        });
      }
    }
  });

  return Array.from(gaps.values());
};

export const submitAssessment = async ({ candidateName, answers }) => {
  const session = driver.session();

  try {
    const questionIds = answers.map((answer) => answer.questionId);

    // ----------------------------------
    // Fetch answers from database
    // ----------------------------------

    const answerDataResult = await session.run(GET_QUESTION_ANSWER_DATA, {
      questionIds,
    });

    if (answerDataResult.records.length !== questionIds.length) {
      const error = new Error("One or more question IDs are invalid");

      error.statusCode = 400;

      throw error;
    }

    const questionData = new Map();

    answerDataResult.records.forEach((record) => {
      questionData.set(record.get("questionId"), {
        correctAnswer: record.get("correctAnswer"),

        skillId: record.get("skillId"),

        skillName: record.get("skillName"),
      });
    });

    // ----------------------------------
    // Evaluate answers
    // ----------------------------------

    const processedAnswers = answers.map((answer) => {
      const question = questionData.get(answer.questionId);

      return {
        questionId: answer.questionId,

        answer: answer.answer,

        correct: answer.answer === question.correctAnswer,

        skillId: question.skillId,

        skillName: question.skillName,
      };
    });

    // ----------------------------------
    // Calculate scores
    // ----------------------------------

    const skillScores = calculateSkillScores(processedAnswers);

    const totalCorrect = processedAnswers.filter(
      (answer) => answer.correct,
    ).length;

    const overallScore = Math.round(
      (totalCorrect / processedAnswers.length) * 100,
    );

    // ----------------------------------
    // Candidate
    // ----------------------------------

    const candidateId = crypto.randomUUID();

    const timestamp = new Date().toISOString();

    // ----------------------------------
    // Store assessment atomically
    // ----------------------------------

    await session.executeWrite(async (transaction) => {
      await transaction.run(CREATE_CANDIDATE, {
        candidateId,
        candidateName,
        createdAt: timestamp,
      });

      await transaction.run(CREATE_ANSWER_RELATIONSHIPS, {
        candidateId,

        answers: processedAnswers.map((answer) => ({
          questionId: answer.questionId,

          answer: answer.answer,

          correct: answer.correct,
        })),

        answeredAt: timestamp,
      });

      await transaction.run(CREATE_SKILL_SCORE_RELATIONSHIPS, {
        candidateId,
        skillScores,
        assessedAt: timestamp,
      });
    });

    // ----------------------------------
    // Find graph-powered skill gaps
    // ----------------------------------

    const gapResult = await session.run(GET_SKILL_GAPS, {
      candidateId,

      // Anything below 70
      // is considered a skill gap.
      threshold: 70,
    });

    const skillGaps = buildSkillGapResult(gapResult.records);

    return {
      candidate: {
        id: candidateId,
        name: candidateName,
      },

      assessment: {
        totalQuestions: processedAnswers.length,

        correctAnswers: totalCorrect,

        overallScore,
      },

      skillScores,

      skillGaps,
    };
  } finally {
    await session.close();
  }
};

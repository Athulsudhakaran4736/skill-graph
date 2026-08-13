export const GET_QUESTION_ANSWER_DATA = `
  MATCH (question:Question)-[:TESTS]->(skill:Skill)

  WHERE question.id IN $questionIds

  RETURN
    question.id AS questionId,
    question.correctAnswer AS correctAnswer,
    skill.id AS skillId,
    skill.name AS skillName
`;

export const CREATE_CANDIDATE = `
  CREATE (candidate:Candidate {
    id: $candidateId,
    name: $candidateName,
    createdAt: $createdAt
  })

  RETURN
    candidate.id AS id,
    candidate.name AS name
`;

export const CREATE_ANSWER_RELATIONSHIPS = `
  UNWIND $answers AS answer

  MATCH (candidate:Candidate {
    id: $candidateId
  })

  MATCH (question:Question {
    id: answer.questionId
  })

  MERGE (candidate)-[relationship:ANSWERED]->(question)

  SET
    relationship.answer = answer.answer,
    relationship.correct = answer.correct,
    relationship.answeredAt = $answeredAt
`;

export const CREATE_SKILL_SCORE_RELATIONSHIPS = `
  UNWIND $skillScores AS skillScore

  MATCH (candidate:Candidate {
    id: $candidateId
  })

  MATCH (skill:Skill {
    id: skillScore.skillId
  })

  MERGE (candidate)-[relationship:HAS_SKILL]->(skill)

  SET
    relationship.score = skillScore.score,
    relationship.correctAnswers = skillScore.correct,
    relationship.totalQuestions = skillScore.total,
    relationship.assessedAt = $assessedAt
`;

export const GET_SKILL_GAPS = `
  MATCH (candidate:Candidate {
    id: $candidateId
  })-[assessment:HAS_SKILL]->(weakSkill:Skill)

  WHERE assessment.score < $threshold

  OPTIONAL MATCH path =
    (affectedSkill:Skill)
    -[:REQUIRES*1..4]->
    (weakSkill)

  RETURN
    weakSkill.id AS weakSkillId,
    weakSkill.name AS weakSkillName,
    assessment.score AS score,

    affectedSkill.id AS affectedSkillId,
    affectedSkill.name AS affectedSkillName,

    CASE
      WHEN path IS NULL THEN null
      ELSE length(path)
    END AS distance

  ORDER BY score ASC, distance ASC
`;

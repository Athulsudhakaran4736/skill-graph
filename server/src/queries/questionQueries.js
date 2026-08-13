export const GET_ASSESSMENT_QUESTIONS = `
  MATCH (question:Question)-[:TESTS]->(skill:Skill)

  RETURN
    question.id AS id,
    question.text AS text,
    question.options AS options,
    question.difficulty AS difficulty,
    skill.id AS skillId,
    skill.name AS skillName
`;

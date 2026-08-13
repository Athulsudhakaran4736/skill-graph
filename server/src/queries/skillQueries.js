export const GET_ALL_SKILLS = `
  MATCH (skill:Skill)

  OPTIONAL MATCH (skill)-[:BELONGS_TO]->(topic:Topic)

  RETURN
    skill.id AS id,
    skill.name AS name,
    skill.description AS description,
    topic.id AS topicId,
    topic.name AS topicName

  ORDER BY topic.name, skill.name
`;

export const GET_SKILL_BY_ID = `
  MATCH (skill:Skill {id: $skillId})

  OPTIONAL MATCH (skill)-[:BELONGS_TO]->(topic:Topic)

  OPTIONAL MATCH (question:Question)-[:TESTS]->(skill)

  RETURN
    skill.id AS id,
    skill.name AS name,
    skill.description AS description,
    topic.id AS topicId,
    topic.name AS topicName,
    count(DISTINCT question) AS questionCount
`;

export const GET_SKILL_PREREQUISITES = `
  MATCH (skill:Skill {id: $skillId})

  OPTIONAL MATCH path =
    (skill)-[:REQUIRES*1..4]->(prerequisite:Skill)

  RETURN
    skill.id AS skillId,
    skill.name AS skillName,
    prerequisite.id AS id,
    prerequisite.name AS name,
    prerequisite.description AS description,
    min(length(path)) AS distance

  ORDER BY distance, name
`;

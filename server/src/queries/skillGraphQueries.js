export const GET_SKILL_GRAPH_NODES = `
  MATCH path =
    (root:Skill {id: $skillId})
    -[:REQUIRES*0..4]->
    (node:Skill)

  OPTIONAL MATCH (node)-[:BELONGS_TO]->(topic:Topic)

  RETURN
    node.id AS id,
    node.name AS name,
    node.description AS description,
    topic.name AS topicName,
    min(length(path)) AS depth

  ORDER BY depth, name
`;

export const GET_SKILL_GRAPH_EDGES = `
  MATCH (source:Skill)-[:REQUIRES]->(target:Skill)

  WHERE
    source.id IN $skillIds
    AND
    target.id IN $skillIds

  RETURN
    source.id AS source,
    target.id AS target
`;

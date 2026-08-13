import driver from "../config/database.js";

import {
  GET_SKILL_GRAPH_NODES,
  GET_SKILL_GRAPH_EDGES,
} from "../queries/skillGraphQueries.js";

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

export const getSkillGraph = async (skillId) => {
  const session = driver.session();

  try {
    const nodeResult = await session.run(GET_SKILL_GRAPH_NODES, {
      skillId,
    });

    if (nodeResult.records.length === 0) {
      return null;
    }

    const nodes = nodeResult.records.map((record) => ({
      id: record.get("id"),
      name: record.get("name"),
      description: record.get("description"),
      topicName: record.get("topicName"),
      depth: convertInteger(record.get("depth")),
    }));

    const skillIds = nodes.map((node) => node.id);

    const edgeResult = await session.run(GET_SKILL_GRAPH_EDGES, {
      skillIds,
    });

    const edges = edgeResult.records.map((record) => ({
      source: record.get("source"),
      target: record.get("target"),
      type: "REQUIRES",
    }));

    return {
      rootSkillId: skillId,
      nodes,
      edges,
    };
  } finally {
    await session.close();
  }
};

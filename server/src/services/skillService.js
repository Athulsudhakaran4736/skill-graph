import driver from "../config/database.js";

import {
  GET_ALL_SKILLS,
  GET_SKILL_BY_ID,
  GET_SKILL_PREREQUISITES,
} from "../queries/skillQueries.js";

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

export const getAllSkills = async () => {
  const session = driver.session();

  try {
    const result = await session.run(GET_ALL_SKILLS);

    return result.records.map((record) => ({
      id: record.get("id"),
      name: record.get("name"),
      description: record.get("description"),

      topic: record.get("topicId")
        ? {
            id: record.get("topicId"),
            name: record.get("topicName"),
          }
        : null,
    }));
  } finally {
    await session.close();
  }
};

export const getSkillById = async (skillId) => {
  const session = driver.session();

  try {
    const result = await session.run(GET_SKILL_BY_ID, {
      skillId,
    });

    if (result.records.length === 0) {
      return null;
    }

    const record = result.records[0];

    return {
      id: record.get("id"),
      name: record.get("name"),
      description: record.get("description"),

      topic: record.get("topicId")
        ? {
            id: record.get("topicId"),
            name: record.get("topicName"),
          }
        : null,

      questionCount: convertInteger(record.get("questionCount")),
    };
  } finally {
    await session.close();
  }
};

export const getSkillPrerequisites = async (skillId) => {
  const session = driver.session();

  try {
    const result = await session.run(GET_SKILL_PREREQUISITES, {
      skillId,
    });

    if (result.records.length === 0) {
      return null;
    }

    const firstRecord = result.records[0];

    const prerequisites = result.records
      .filter((record) => record.get("id"))
      .map((record) => ({
        id: record.get("id"),
        name: record.get("name"),
        description: record.get("description"),
        distance: convertInteger(record.get("distance")),
      }));

    return {
      skill: {
        id: firstRecord.get("skillId"),
        name: firstRecord.get("skillName"),
      },

      prerequisites,
    };
  } finally {
    await session.close();
  }
};

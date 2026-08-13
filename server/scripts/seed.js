import driver from "../src/config/database.js";

import {
  topics,
  skills,
  questions,
  prerequisiteRelationships,
  relatedSkillRelationships,
} from "./seedData.js";

const seedDatabase = async () => {
  const session = driver.session();

  try {
    console.log("Starting SkillGraph database seed...");

    // ----------------------------------------
    // Topics
    // ----------------------------------------

    await session.run(
      `
      UNWIND $topics AS topic

      MERGE (t:Topic {id: topic.id})

      SET
        t.name = topic.name,
        t.description = topic.description
      `,
      {
        topics,
      },
    );

    console.log(`Seeded ${topics.length} topics`);

    // ----------------------------------------
    // Skills
    // ----------------------------------------

    await session.run(
      `
      UNWIND $skills AS skill

      MERGE (s:Skill {id: skill.id})

      SET
        s.name = skill.name,
        s.description = skill.description
      `,
      {
        skills,
      },
    );

    console.log(`Seeded ${skills.length} skills`);

    // ----------------------------------------
    // Skill -> Topic relationships
    // ----------------------------------------

    await session.run(
      `
      UNWIND $skills AS skill

      MATCH (s:Skill {id: skill.id})
      MATCH (t:Topic {id: skill.topicId})

      MERGE (s)-[:BELONGS_TO]->(t)
      `,
      {
        skills,
      },
    );

    console.log("Created BELONGS_TO relationships");

    // ----------------------------------------
    // REQUIRES relationships
    // ----------------------------------------

    await session.run(
      `
      UNWIND $relationships AS relationship

      MATCH (source:Skill {
        id: relationship.from
      })

      MATCH (target:Skill {
        id: relationship.to
      })

      MERGE (source)-[:REQUIRES]->(target)
      `,
      {
        relationships: prerequisiteRelationships,
      },
    );

    console.log("Created REQUIRES relationships");

    // ----------------------------------------
    // RELATED_TO relationships
    // ----------------------------------------

    await session.run(
      `
      UNWIND $relationships AS relationship

      MATCH (source:Skill {
        id: relationship.from
      })

      MATCH (target:Skill {
        id: relationship.to
      })

      MERGE (source)-[:RELATED_TO]->(target)
      `,
      {
        relationships: relatedSkillRelationships,
      },
    );

    console.log("Created RELATED_TO relationships");

    // ----------------------------------------
    // Questions
    // ----------------------------------------

    await session.run(
      `
      UNWIND $questions AS question

      MERGE (q:Question {id: question.id})

      SET
        q.text = question.text,
        q.options = question.options,
        q.correctAnswer = question.correctAnswer,
        q.difficulty = question.difficulty
      `,
      {
        questions,
      },
    );

    console.log(`Seeded ${questions.length} questions`);

    // ----------------------------------------
    // Question -> Skill
    // ----------------------------------------

    await session.run(
      `
      UNWIND $questions AS question

      MATCH (q:Question {
        id: question.id
      })

      MATCH (s:Skill {
        id: question.skillId
      })

      MERGE (q)-[:TESTS]->(s)
      `,
      {
        questions,
      },
    );

    console.log("Created TESTS relationships");

    // ----------------------------------------
    // Verify node counts
    // ----------------------------------------

    const countResult = await session.run(`
      MATCH (n)

      RETURN
        labels(n)[0] AS label,
        count(n) AS count

      ORDER BY label
    `);

    console.log("\nDatabase contents:");

    countResult.records.forEach((record) => {
      const label = record.get("label");
      const count = record.get("count");

      console.log(`${label}: ${count.toNumber ? count.toNumber() : count}`);
    });

    // ----------------------------------------
    // Verify multi-hop traversal
    // ----------------------------------------

    const traversalResult = await session.run(
      `
      MATCH path =
        (skill:Skill {id: $skillId})
        -[:REQUIRES*1..4]->
        (prerequisite:Skill)

      RETURN
        prerequisite.name AS skill,
        length(path) AS distance

      ORDER BY distance
      `,
      {
        skillId: "nextjs",
      },
    );

    console.log("\nNext.js prerequisite traversal:");

    traversalResult.records.forEach((record) => {
      const skill = record.get("skill");
      const distance = record.get("distance");

      console.log(`${skill} - ${distance.toNumber()} hop(s)`);
    });

    console.log("\nSkillGraph seed completed successfully.");
  } catch (error) {
    console.error("Failed to seed SkillGraph:", error.message);

    process.exitCode = 1;
  } finally {
    await session.close();
    await driver.close();
  }
};

seedDatabase();

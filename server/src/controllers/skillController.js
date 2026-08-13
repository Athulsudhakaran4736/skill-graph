import {
  getAllSkills,
  getSkillById,
  getSkillPrerequisites,
} from "../services/skillService.js";

export const fetchSkills = async (req, res, next) => {
  try {
    const skills = await getAllSkills();

    res.status(200).json({
      success: true,
      count: skills.length,
      data: skills,
    });
  } catch (error) {
    next(error);
  }
};

export const fetchSkillById = async (req, res, next) => {
  try {
    const { skillId } = req.params;

    const skill = await getSkillById(skillId);

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: "Skill not found",
      });
    }

    res.status(200).json({
      success: true,
      data: skill,
    });
  } catch (error) {
    next(error);
  }
};

export const fetchSkillPrerequisites = async (req, res, next) => {
  try {
    const { skillId } = req.params;

    const result = await getSkillPrerequisites(skillId);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Skill not found",
      });
    }

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

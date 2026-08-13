import { getSkillGraph } from "../services/skillGraphService.js";

export const fetchSkillGraph = async (req, res, next) => {
  try {
    const { skillId } = req.params;

    const graph = await getSkillGraph(skillId);

    if (!graph) {
      return res.status(404).json({
        success: false,
        message: "Skill not found",
      });
    }

    res.status(200).json({
      success: true,
      data: graph,
    });
  } catch (error) {
    next(error);
  }
};

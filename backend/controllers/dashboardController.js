const db = require("../config/db");

const getDashboard = async (
  req,
  res
) => {
  try {
    const userId = req.params.userId;

    const [projects] =
      await db.query(
        `
      SELECT COUNT(*) total
      FROM Projects
      WHERE CreatedBy=?
    `,
        [userId]
      );

    const [tasks] =
      await db.query(
        `
      SELECT COUNT(*) total
      FROM Tasks
      WHERE AssignedTo=?
    `,
        [userId]
      );

    const [completed] =
      await db.query(
        `
      SELECT COUNT(*) total
      FROM Tasks
      WHERE AssignedTo=?
      AND Status='DONE'
    `,
        [userId]
      );

    const [progress] =
      await db.query(
        `
      SELECT COUNT(*) total
      FROM Tasks
      WHERE AssignedTo=?
      AND Status='IN_PROGRESS'
    `,
        [userId]
      );

    const [recentProjects] =
      await db.query(
        `
      SELECT *
      FROM Projects
      WHERE CreatedBy=?
      ORDER BY CreatedAt DESC
      LIMIT 5
    `,
        [userId]
      );

    const [recentTasks] =
      await db.query(
        `
      SELECT *
      FROM Tasks
      WHERE AssignedTo=?
      ORDER BY CreatedAt DESC
      LIMIT 5
    `,
        [userId]
      );

    res.json({
      totalProjects:
        projects[0].total,

      totalTasks:
        tasks[0].total,

      completedTasks:
        completed[0].total,

      inProgressTasks:
        progress[0].total,

      recentProjects,

      recentTasks,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

module.exports = {
  getDashboard,
};
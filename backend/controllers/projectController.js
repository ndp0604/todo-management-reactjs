const db = require("../config/db");

const getProjects = async (req, res) => {
  try {
    const userId = req.params.userId;

    const [projects] = await db.query(
      `
      SELECT *
      FROM Projects
      WHERE CreatedBy = ?
      `,
      [userId]
    );

    res.json(projects);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Lỗi server",
    });
  }
};

module.exports = {
  getProjects,
};
const express = require("express");
const router = express.Router();

const {
  getProjects,
} = require("../controllers/projectController");

router.get("/:userId", getProjects);

module.exports = router;
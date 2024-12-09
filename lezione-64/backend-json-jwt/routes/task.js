const express = require("express");
const { check } = require("express-validator");

const router = express.Router();
const taskController = require("../controller/task");
const { checkAuth } = require("../middleware/checkAuth");
const { sleep } = require("../middleware/sleep");

router.get("/", sleep, taskController.getAllTasks);
router.get("/:id", sleep, taskController.getTask);

router.post(
  "/",
  sleep,
  checkAuth,
  [check("name").not().isEmpty()],
  taskController.addTask
);

router.put("/:id", sleep, checkAuth, taskController.editTask);
router.patch("/:id", sleep, checkAuth, taskController.editTask);

router.put("/toggle/:id", sleep, checkAuth, taskController.toggleTask);
router.patch("/toggle/:id", sleep, checkAuth, taskController.toggleTask);

router.delete("/:id", sleep, checkAuth, taskController.deleteTask);

module.exports = router;

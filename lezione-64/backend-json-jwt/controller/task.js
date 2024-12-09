const fs = require("node:fs/promises");
const { validationResult } = require("express-validator");
const { v4: uuidv4 } = require("uuid");

module.exports.getAllTasks = async (req, res, next) => {
  // Leggo da tasks.json
  const file = await fs.readFile("./data/tasks.json", "utf8");
  const data = JSON.parse(file);
  return res.json(data);
};

module.exports.getTask = async (req, res, next) => {
  const id = req.params.id;
  const file = await fs.readFile("./data/tasks.json", "utf8");
  const data = JSON.parse(file);
  const task = data.tasks.find((task) => id === task._id);

  if (task) {
    return res.json({ task });
  } else {
    return res.status(404).json({ message: "task not found" });
  }
};

module.exports.addTask = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res
      .status(422)
      .json({ error: "Invalid inputs passed, please check your data." });
  }

  const { name } = req.body;
  const createdTask = {
    name,
    isCompleted: false,
    _id: uuidv4(),
  };
  try {
    const file = await fs.readFile("./data/tasks.json", "utf8");
    const data = JSON.parse(file);
    const newTasks = [createdTask, ...data.tasks];
    await fs.writeFile(
      "./data/tasks.json",
      JSON.stringify({ tasks: newTasks })
    );

    return res.status(201).json({ task: createdTask });
  } catch (err) {
    return res.status(500).json({ error: "Task creation failed" });
  }
};

module.exports.editTask = async (req, res, next) => {
  const { name, description, category } = req.body;
  const taskId = req.params.id;

  try {
    const file = await fs.readFile("./data/tasks.json", "utf8");
    const data = JSON.parse(file);
    let updatedTask = {};
    let newTasks = data.tasks.map((task) => {
      if (task._id == taskId) {
        updatedTask = {
          ...task,
          name,
        };
        return updatedTask;
      }
      return task;
    });
    console.log(updatedTask);
    await fs.writeFile(
      "./data/tasks.json",
      JSON.stringify({ tasks: newTasks })
    );

    return res.status(200).json({ task: updatedTask });
  } catch (err) {
    return res.status(500).json({ error: "Task update failed" });
  }
};

module.exports.toggleTask = async (req, res, next) => {
  const taskId = req.params.id;

  try {
    const file = await fs.readFile("./data/tasks.json", "utf8");
    const data = JSON.parse(file);
    let updatedTask;
    let newTasks = data.tasks.map((task) => {
      if (task._id == taskId) {
        updatedTask = {
          ...task,
          isCompleted: !task.isCompleted,
        };
        return updatedTask;
      }
      return task;
    });
    if (!updatedTask) {
      return res
        .status(404)
        .json({ error: "Could not find task with this id." });
    }
    await fs.writeFile(
      "./data/tasks.json",
      JSON.stringify({ tasks: newTasks })
    );

    return res.status(200).json({ task: updatedTask });
  } catch (err) {
    return res.status(500).json({ error: "Task update failed" });
  }
};

module.exports.deleteTask = async (req, res, next) => {
  const taskId = req.params.id;

  try {
    const file = await fs.readFile("./data/tasks.json", "utf8");
    let data = JSON.parse(file);
    const taskToDelete = data.tasks.find((task) => task._id === taskId);
    if (!taskToDelete) {
      return res
        .status(404)
        .json({ error: "Could not find task with this id." });
    }
    let updatedTasks = data.tasks.filter((task) => task._id !== taskId);

    let updatedTasksList = {
      tasks: updatedTasks,
    };
    await fs.writeFile("./data/tasks.json", JSON.stringify(updatedTasksList));

    return res.status(200).json({ message: "Deleted task." });
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Something went wrong, could not delete task." });
  }
};

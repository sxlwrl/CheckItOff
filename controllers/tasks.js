"use strict";

const taskModel = require("../models/task-model");

exports.createTask = async (req, res) => {
  try {
    const taskData = {
      user_id: req.user.ID,
      task_name: req.body.name,
      task_description: req.body.description,
      task_priority: req.body.priority,
      task_date: req.body.date,
      task_status: 1,
    };

    await taskModel.createTask(taskData);
    res.redirect("/main");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error");
  }
};

exports.editTask = async (req, res) => {
  try {
    const tasks = await taskModel.getTasksByUserId(req.user.ID);
    res.render(`main`, { tasks, taskID: req.params.id, editing: true });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error");
  }
};

exports.updateTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const taskData = {
      task_name: req.body.name,
      task_description: req.body.description,
      task_priority: req.body.priority,
      task_status: req.body.status,
    };

    const updated = await taskModel.updateTask(taskId, taskData);
    updated ? res.redirect("/main") : res.status(404).send("Task not found");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const deleted = await taskModel.deleteTask(taskId);
    deleted ? res.redirect("/main") : res.status(404).send("Task not found");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

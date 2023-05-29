'use strict';

const taskModel = require('../models/task-model');

class Task {
    async createTask(req, res) {
        try {
            const taskData = {
                user_id: req.user.ID,
                task_name: req.body.name,
                task_description: req.body.description,
                task_priority: req.body.priority,
                task_date: req.body.date,
                task_status: 1,
            };
            console.log(req.body);
            await taskModel.createTask(taskData);
            res.redirect('/main');
        } catch (error) {
            console.error(error);
            res.status(500).send('Error');
        }
    };

    async editTask(req, res) {
        try {
            const tasks = await taskModel.getTasksByUserId(req.user.ID);
            const task = await taskModel.getTaskById(req.params.id);
            const user = req.user;
            res.render(`main`, {
                tasks,
                task,
                taskID: req.params.id,
                editing: true,
                user,
            });
            const x = 'x';
        } catch (error) {
            console.error(error);
            res.status(500).send('Error');
        }
    };

    async updateTask(req, res) {
        try {
            const taskId = req.params.id;
            const taskData = {
                task_name: req.body.name,
                task_description: req.body.description,
                task_priority: req.body.priority,
                task_date: req.body.date,
            };

            const updated = await taskModel.updateTask(taskId, taskData);
            updated
                ? res.redirect('/main')
                : res.status(404).send('Task not found');


        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    };

    async deleteTask(req, res) {
        try {
            const deleted = await taskModel.deleteTask(req.params.id);
            deleted
                ? res.redirect('/main')
                : res.status(404).send('Task not found');
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    };

    async updateTaskStatus(req, res) {
        try {
            const taskId = req.params.id;
            const taskStatus = +req.body.status
            const updated = await taskModel.updateTaskStatus(taskId, taskStatus);

            updated
                ? res.sendStatus(200)
                : res.status(404).send('Task not found');
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    };
}

module.exports = new Task();

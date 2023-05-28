'use strict';

const {database} = require('../database/database');

class TaskModel {
    constructor(database) {
        this.database = database;
    }

    createTask(taskData) {
        return new Promise((resolve, reject) => {
            this.database.query('INSERT INTO tasks SET ?', taskData, (error, result) => {
                error ? reject(error) : resolve(result.insertId);
            });
        });
    };

    getTasksByUserId(user_id) {
        return new Promise((resolve, reject) => {
            this.database.query('SELECT * FROM tasks WHERE user_id = ?', [user_id], (error, results) => {
                error ? reject(error) : resolve(results);
            });
        });
    };

    getTaskById(taskId) {
        return new Promise((resolve, reject) => {
            this.database.query('SELECT * FROM tasks WHERE task_id = ?', [taskId], (error, results) => {
                error ? reject(error) : resolve(results[0]);
            });
        });
    };

    updateTask(taskId, taskData) {
        return new Promise((resolve, reject) => {
            this.database.query('UPDATE tasks SET ? WHERE task_id = ?', [taskData, taskId], (error, result) => {
                error ? reject(error) : resolve(result.affectedRows > 0);
            });
        });
    };

    deleteTask(taskId) {
        return new Promise((resolve, reject) => {
            this.database.query('DELETE FROM tasks WHERE task_id = ?', [taskId], (error, result) => {
                error ? reject(error) : resolve(result.affectedRows > 0);
            });
        });
    };
}

module.exports = new TaskModel(database);
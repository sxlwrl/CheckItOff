'use strict';

const {database} = require('../database/database');

exports.getTasksByUserId = (user_id) => {
    return new Promise((resolve, reject) => {
        console.log(user_id);
        database.query('SELECT * FROM tasks WHERE user_id = ?', [user_id], (error, results) => {
            error ? reject(error) : resolve(results);
        });
    });
};

exports.createTask = (taskData) => {
    return new Promise((resolve, reject) => {
        database.query('INSERT INTO tasks SET ?', taskData, (error, result) => {
            error ? reject(error) : resolve(result.insertId);
        });
    });
};

exports.getTaskById = (taskId) => {
    return new Promise((resolve, reject) => {
        database.query('SELECT * FROM tasks WHERE task_id = ?', [taskId], (error, results) => {
            error ? reject(error) : resolve(results[0]);
        });
    });
};

exports.updateTask = (taskId, taskData) => {
    return new Promise((resolve, reject) => {
        database.query('UPDATE tasks SET ? WHERE task_id = ?', [taskData, taskId], (error, result) => {
            error ? reject(error) : resolve(result.affectedRows > 0);
        });
    });
};

exports.deleteTask = (taskId) => {
    return new Promise((resolve, reject) => {
        database.query('DELETE FROM tasks WHERE task_id = ?', [taskId], (error, result) => {
            error ? reject(error) : resolve(result.affectedRows > 0);
        });
    });
};

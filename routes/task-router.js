'use strict';

const express = require('express');
const taskController = require('../controllers/tasks');
const {authMiddleware} = require('../middlewares/authMiddlewares');
const router = express.Router();


router.post('/task', authMiddleware, taskController.createTask);
router.get('/task/:id/edit', authMiddleware, taskController.editTask);
router.post('/task/:id', authMiddleware, taskController.updateTask);
router.post('/task/:id/delete', authMiddleware, taskController.deleteTask);
router.post('/task/:id/status', authMiddleware, taskController.updateTaskStatus);

module.exports = router;

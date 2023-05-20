'use strict';

const express = require('express');
const taskController = require("../controllers/tasks");
const userController = require('../controllers/users');
const {authMiddleware} = require('../middlewares/authMiddlewares');
const router = express.Router();


router.post('/task', authMiddleware, taskController.createTask);
router.get('/task/:id/edit', authMiddleware, taskController.editTask);
router.post('/task/:id', taskController.updateTask);
router.post('/task/:id/delete', taskController.deleteTask);

module.exports = router;
// import mongoose from "mongoose";
// import bcrypt from "bcryptjs";
// import jwt from 'jsonwebtoken'
//import type { StringValue } from 'ms';
import Task from "../models/task.model.js";
import TaskList from "../models/task-list.model.js";
//import User  from "../models/user.model.js";
// interface AuthenticatedRequest extends Request {
//     user: typeof User;
// }
export const createTask = async (req, res, next) => {
    // get task list id from req.params add the new task to that list if not provided, it should be added to the default list of that user. Every user should have a default task list created at the time of user registration.
    try {
        const taskListId = req.body.taskListId || req.params.taskListId;
        let taskList;
        if (taskListId) {
            taskList = await TaskList.findById(taskListId);
            if (!taskList) {
                const error = new Error('TaskList not found');
                error.statusCode = 404;
                throw error;
            }
            if (taskList.userId?.toString() !== req.user._id.toString()) {
                const error = new Error('Not authorized to add tasks to this list');
                error.statusCode = 403;
                throw error;
            }
        }
        else {
            taskList = await TaskList.findOne({ userId: req.user._id, isDefault: true });
            if (!taskList) {
                taskList = await TaskList.create({
                    name: 'My Tasks',
                    description: 'Default task list',
                    userId: req.user._id,
                    isDefault: true,
                });
            }
        }
        const task = await Task.create({
            ...req.body,
            userId: req.user._id,
            taskListId: taskList._id,
        });
        // add task to taskList
        taskList.tasks = taskList.tasks ?? [];
        taskList.tasks.push(task._id);
        await taskList.save();
        res.status(201).json({
            success: true,
            message: 'Task created successfully',
            data: task
        });
    }
    catch (error) {
        next(error);
    }
};
// Creates a new list of tasks
export const createTaskList = async (req, res, next) => {
    try {
        const task = await TaskList.create({
            ...req.body,
            userId: req.user._id,
        });
        res.status(201).json({ success: true, message: "Task list created successfully", data: task });
    }
    catch (error) {
        next(error);
    }
};
export const updateATaskList = async (req, res, next) => {
    try {
        const taskListId = req.params.id;
        const taskList = await TaskList.findById(taskListId);
        if (!taskList) {
            const error = new Error('TaskList not found');
            error.statusCode = 404;
            throw error;
        }
        if (taskList.userId?.toString() !== req.user._id.toString()) {
            const error = new Error('Not authorized to update this list');
            error.statusCode = 403;
            throw error;
        }
        // Should not allow changing the userId, createdAt, isDefault, _id
        Object.assign(taskList, req.body);
        await taskList.save();
        res.status(200).json({ success: true, message: "Task list updated successfully", data: taskList });
    }
    catch (error) {
        next(error);
    }
};
export const updateATask = async (req, res, next) => {
    try {
        const taskId = req.params.id;
        const task = await Task.findById(taskId);
        if (!task) {
            const error = new Error('Task not found');
            error.statusCode = 404;
            throw error;
        }
        if (task.userId?.toString() !== req.user._id.toString()) {
            const error = new Error('Not authorized to update this task');
            error.statusCode = 403;
            throw error;
        }
        // Should not allow changing the userId, createdAt, taskListId, _id
        Object.assign(task, req.body);
        await task.save();
        res.status(200).json({ success: true, message: "Task updated successfully", data: task });
    }
    catch (error) {
        next(error);
    }
};
export const deleteTask = async (req, res, next) => {
    try {
        const taskId = req.params.id;
        const task = await Task.findById(taskId);
        if (!task) {
            const error = new Error('Task not found');
            error.statusCode = 404;
            throw error;
        }
        if (task.userId?.toString() !== req.user._id.toString()) {
            const error = new Error('Not authorized to delete this task');
            error.statusCode = 403;
            throw error;
        }
        await task.deleteOne({ ...task });
        res.status(200).json({ success: true, message: "Task deleted successfully" });
    }
    catch (error) {
        next(error);
    }
};
export const deleteTaskList = async (req, res, next) => {
    // This deletes all tasks associated with this list
    try {
        const taskListId = req.params.id;
        const taskList = await TaskList.findById(taskListId);
        if (!taskList) {
            const error = new Error('TaskList not found');
            error.statusCode = 404;
            throw error;
        }
        if (taskList.userId?.toString() !== req.user._id.toString()) {
            const error = new Error('Not authorized to delete this list');
            error.statusCode = 403;
            throw error;
        }
        await Task.deleteMany({ taskListId: taskList._id });
        await taskList.deleteOne({ ...taskList });
        res.status(200).json({ success: true, message: "Task list and associated tasks deleted successfully" });
    }
    catch (error) {
        next(error);
    }
};
export const getTasksByStatus = async (req, res, next) => {
    try {
        const status = req.params.status;
        const tasks = await Task.find({ userId: req.user._id, status: status });
        res.status(200).json({ success: true, data: tasks });
    }
    catch (error) {
        next(error);
    }
};
export const getATaskList = async (req, res, next) => {
    // try {
    //     const taskLists = await TaskList.find({ userId: req.user._id }).populate('tasks') ?? [];
    //     res.status(200).json({success: true, data: taskLists});
    // } catch (error){
    //     next(error);
    // }   
};
export const getAllTasks = (req, res, next) => {
    // try {
    //     res.status(200).json({ title : 'GET all tasks' });
    // } catch (error){
    //     next(error);
    // }
};
//# sourceMappingURL=task.controller.js.map
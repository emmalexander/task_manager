// import mongoose from "mongoose";
// import bcrypt from "bcryptjs";
// import jwt from 'jsonwebtoken'

import type { Request, Response, NextFunction } from "express";
//import type { StringValue } from 'ms';

import Task from "../models/task.model.js";
import TaskList from "../models/task-list.model.js";
//import User  from "../models/user.model.js";

// interface AuthenticatedRequest extends Request {
//     user: typeof User;
// }

export const createTask = async (req: any, res: Response, next: NextFunction)=> {
    // get task list id from req.params add the new task to that list if not provided, it should be added to the default list of that user. Every user should have a default task list created at the time of user registration.
    try {
        const taskListId = req.body.taskListId || req.params.taskListId;

        let taskList;

        if (taskListId) {
            taskList = await TaskList.findById(taskListId);
            if(!taskList){
                const error: any = new Error('TaskList not found');
                error.statusCode = 404;
                throw error;
            }
            if (taskList.userId?.toString() !== req.user._id.toString()){
                const error: any = new Error('Not authorized to add tasks to this list');
                error.statusCode = 403;
                throw error;
            }
        } else {
            taskList = await TaskList.findOne({ userId: req.user._id, isDefault: true });
            if(!taskList){
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

        res.status(201).json({success: true, data: task});

    } catch(error){
        next(error);
    }
};

// Creates a new list of tasks
export const createTaskList = async (req: any, res: Response, next: NextFunction)=> {
    try {

        const task = await TaskList.create({
            ...req.body,
            userId: req.user._id,
        });

        res.status(201).json({success: true, data: task});

    } catch(error){
        next(error);
    }
};

export const getATaskList = async (req: any, res: Response, next: NextFunction)=> {};

export const getUserTaskLists = (req: any, res: Response, next: NextFunction)=> {};

export const getAllTasks = (req: any, res: Response, next: NextFunction)=> {};

export const getTaskDetails = (req: any, res: Response, next: NextFunction)=> {};

export const getUserTasks = (req: any, res: Response, next: NextFunction)=> {};


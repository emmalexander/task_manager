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

        res.status(201).json({
            success: true,
            message: 'Task created successfully',
            data: task});

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

        res.status(201).json({success: true, message: "Task list created successfully", data: task});

    } catch(error){
        next(error);
    }
};

export const updateATaskList = async (req: any, res: Response, next: NextFunction)=> {
    try {
        const taskListId = req.params.id;

        const taskList = await TaskList.findById(taskListId);

        if(!taskList){
            const error: any = new Error('TaskList not found');
            error.statusCode = 404;
            throw error;
        }

        if (taskList.userId?.toString() !== req.user._id.toString()){
            const error: any = new Error('Not authorized to update this list');
            error.statusCode = 403;
            throw error;
        }

        // Should not allow changing the userId, createdAt, isDefault, _id
        Object.assign(taskList, req.body);
        await taskList.save();

        res.status(200).json({success: true,message: "Task list updated successfully", data: taskList});

    } catch(error){
        next(error);
    }
};

export const updateATask = async (req: any, res: Response, next: NextFunction)=> {
    try{
        const taskId = req.params.id;

        const task =  await Task.findById(taskId);

        if(!task){
            const error: any = new Error('Task not found');
            error.statusCode = 404;
            throw error;
        }

        if (task.userId?.toString() !== req.user._id.toString()){
            const error: any = new Error('Not authorized to update this task');
            error.statusCode = 403;
            throw error;
        }

        // Should not allow changing the userId, createdAt, taskListId, _id
        Object.assign(task, req.body);
        await task.save();

        res.status(200).json({success: true, message: "Task updated successfully", data: task});
    }catch(error){
        next(error);
    }
};

export const deleteTask = async (req: any, res: Response, next: NextFunction)=> {
    try {
        const taskId = req.params.id;

        const task = await Task.findById(taskId);

        if(!task){
            const error: any = new Error('Task not found');
            error.statusCode = 404;
            throw error;
        }

        if (task.userId?.toString() !== req.user._id.toString()){
            const error: any = new Error('Not authorized to delete this task');
            error.statusCode = 403;
            throw error;
        }

        await task.deleteOne({...task});

        res.status(200).json({success: true,message: "Task deleted successfully"});
    } catch(error){
        next(error);
    }
};

export const deleteTaskList = async (req: any, res: Response, next: NextFunction)=> {
    // This deletes all tasks associated with this list
    try {
        const taskListId = req.params.id;

        const taskList = await TaskList.findById(taskListId);

        if(!taskList){
            const error: any = new Error('TaskList not found');
            error.statusCode = 404;
            throw error;
        }

        if (taskList.userId?.toString() !== req.user._id.toString()){
            const error: any = new Error('Not authorized to delete this list');
            error.statusCode = 403;
            throw error;
        }

        await Task.deleteMany({ taskListId: taskList._id });

        await taskList.deleteOne({...taskList});

        res.status(200).json({success: true,message: "Task list and associated tasks deleted successfully"});
    } catch(error){
        next(error);
    }
};

export const getUserTasksByStatus = async (req: any, res: Response, next: NextFunction)=> {
    try {
        const status = req.params.status;

        const tasks = await Task.find({ userId: req.user._id, status: status }).select("-__v");

        res.status(200).json({success: true, data: tasks});
    } catch (error){
        next(error);
    }
}

export const getUserTaskLists = async (req: any, res: Response, next: NextFunction)=> {
    try {
        const taskLists = await TaskList.find({ userId: req.user._id });

        res.status(200).json({success: true, data: taskLists});
    } catch (error){
        next(error);
    }   
};

export const getUserTasks = async (req: any, res: Response, next: NextFunction)=> {
    try {
        const status = req.params.status;

        // const sort = req.query.sort;
        var queryObject = { userId: req.user._id };

        let results = Task.find(queryObject).select("-__v");

        if(status){
            const statusObject = {status: status};
            queryObject = { ...queryObject, ...statusObject};
        }

        // if(sort){
        //  results = results.sort(sort.split(",").join(" "));
        //  }

        // Add pagination here
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        
        const skip = (page - 1) * limit;

        results = results.skip(skip).limit(limit);

        const tasks = await results;
        const totalPages = tasks.length;

        res.status(200).json({success: true, data: {
            page: page, 
            totalPages: totalPages, 
            tasks: tasks
        }});
    } catch (error){
        next(error);
    }   
};

export const addTaskToFavorite = async (req: any, res: Response, next: NextFunction)=> {
    try {
        const taskId = req.params.id;

        const task = await Task.findById(taskId);

        if(!task){
            const error: any = new Error('Task not found');
            error.statusCode = 404;
            throw error;
        }

        if (task.userId?.toString() !== req.user._id.toString()){
            const error: any = new Error('Not authorized to update this task');
            error.statusCode = 403;
            throw error;
        }

        // Should not allow changing the userId, createdAt, taskListId, _id
        //Object.assign(task, req.body);
        task.isStarred = true;
        await task.save();

        res.status(200).json({success: true,message: "Task updated successfully", data: task});
    } catch (error){
        next(error);
    }

    
}

export const removeTaskFromFavorite = async (req: any, res: Response, next: NextFunction)=> {
    try {
        const taskId = req.params.id;

        const task = await Task.findById(taskId);

        if(!task){
            const error: any = new Error('Task not found');
            error.statusCode = 404;
            throw error;
        }

        if (task.userId?.toString() !== req.user._id.toString()){
            const error: any = new Error('Not authorized to update this task');
            error.statusCode = 403;
            throw error;
        }

        // Should not allow changing the userId, createdAt, taskListId, _id
        //Object.assign(task, req.body);
        task.isStarred = false;
        await task.save();

        res.status(200).json({success: true,message: "Task updated successfully", data: task});
    } catch (error){
        next(error);
    }

    
}

export const getPendingTasks = async (req: any, res: Response, next: NextFunction) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Get total count of pending tasks for the user
        const totalTasks = await Task.countDocuments({ userId: req.user._id, status: "pending" });

        // Get paginated tasks
        const tasks = await Task.find({ userId: req.user._id, status: "pending" }).select("-__v")
            .skip(skip)
            .limit(limit);

        const totalPages = Math.ceil(totalTasks / limit);

        res.status(200).json({
            success: true,
            data: {
                page: page,
                totalPages: totalPages,
                totalTasks: totalTasks,
                tasks: tasks
            }
        });
    } catch (error) {
        next(error);
    }
}

export const getInProgressTasks = async (req: any, res: Response, next: NextFunction) => {
        try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Get total count of pending tasks for the user
        const totalTasks = await Task.countDocuments({ userId: req.user._id, status: "in-progress" });

        // Get paginated tasks
        const tasks = await Task.find({ userId: req.user._id, status: "in-progress" }).select("-__v")
            .skip(skip)
            .limit(limit);

        const totalPages = Math.ceil(totalTasks / limit);

        res.status(200).json({
            success: true,
            data: {
                page: page,
                totalPages: totalPages,
                totalTasks: totalTasks,
                tasks: tasks
            }
        });
    } catch (error) {
        next(error);
    }
}

export const getCompletedTasks = async (req: any, res: Response, next: NextFunction) => {
        try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Get total count of pending tasks for the user
        const totalTasks = await Task.countDocuments({ userId: req.user._id, status: "completed" });

        // Get paginated tasks
        const tasks = await Task.find({ userId: req.user._id, status: "completed" }).select("-__v")
            .skip(skip)
            .limit(limit);

        const totalPages = Math.ceil(totalTasks / limit);

        res.status(200).json({
            success: true,
            data: {
                page: page,
                totalPages: totalPages,
                totalTasks: totalTasks,
                tasks: tasks
            }
        });
    } catch (error) {
        next(error);
    }
}

export const updateATaskStatus = async (req: any, res: Response, next: NextFunction)=> {
    try{
        const taskId = req.params.id;

        const newStatus = req.body.status;

        const task =  await Task.findById(taskId).select("-__v");

        if(!task){
            const error: any = new Error('Task not found');
            error.statusCode = 404;
            throw error;
        }

        if (task.userId?.toString() !== req.user._id.toString()){
            const error: any = new Error('Not authorized to update this task');
            error.statusCode = 403;
            throw error;
        }
        
        task.status = newStatus;
        await task.save();

        res.status(200).json({success: true,message: "Task updated successfully", data: task});
    }catch(error){
        next(error);
    }
};

export const searchTasks  = async (req: any, res: Response, next: NextFunction)=> {
    try {

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // tast title, description
        const name = (req.query.name || req.params.name);
        //const description = req.query.description || req.params.description;

        const query: any = { userId: req.user._id };
        if (name) {
            query.title = { $regex: name, $options: "i" };
        }

        const totalResults = await Task.countDocuments(query);

        const tasks = await Task.find(query).select("-__v").skip(skip).limit(limit);

        //const totalPages = Math.ceil(totalTasks / limit);

        res.status(200).json({
            success: true,
            data: {
                page: page,
                totalResult: totalResults,
                results: tasks
            }
        });

    } catch(error) {
        next(error);
    }
}
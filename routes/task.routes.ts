import { Router } from "express";
import authorize from "../middlewares/auth.middleware.js";
import { createTask, createTaskList, getUserTaskLists, updateATaskList, updateATask, deleteTask, deleteTaskList, getUserTasksByStatus, getUserTasks, addTaskToFavorite, removeTaskFromFavorite, getPendingTasks, getInProgressTasks, getCompletedTasks } from "../controllers/task.controller.js";

const taskRouter = Router();

// /api/v1/tasks/

taskRouter.post('/', authorize, createTask);

taskRouter.post('/lists', authorize, createTaskList);

taskRouter.get('/lists', authorize, getUserTaskLists);

taskRouter.get('/status/:status', authorize, getUserTasksByStatus);

taskRouter.get('/pending', authorize, getPendingTasks);

taskRouter.get('/in-progress', authorize, getInProgressTasks);

taskRouter.get('/completed', authorize, getCompletedTasks);

taskRouter.get('/', authorize, getUserTasks);

taskRouter.put('/lists/:id', authorize, updateATaskList);

taskRouter.put('/:id', authorize, updateATask);

taskRouter.put('/favorites/add/:id', authorize, addTaskToFavorite);

taskRouter.put('/favorites/remove/:id', authorize, removeTaskFromFavorite);

taskRouter.delete('/:id', authorize, deleteTask);

taskRouter.delete('/lists/:id', authorize, deleteTaskList);

export default taskRouter;
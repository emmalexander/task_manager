import { Router } from "express";
import authorize from "../middlewares/auth.middleware.js";
import { createTask, createTaskList, getATaskList, getUserTaskLists, getAllTasks, getTaskDetails, getUserTasks } from "../controllers/task.controller.js";

const taskRouter = Router();

taskRouter.post('/', authorize, createTask);

taskRouter.post('/lists', authorize, createTaskList);

taskRouter.get('/', authorize, getAllTasks);

taskRouter.get('/lists', authorize, getATaskList);

taskRouter.get('/:id', authorize, getTaskDetails);

taskRouter.put('/:id', authorize, (req, res) => res.send({ title : 'UPDATE task' }));

taskRouter.delete('/:id', authorize, (req, res) => res.send({ title : 'DELETE task' }));

taskRouter.get('/user', authorize, getUserTasks);

taskRouter.get('/user/lists', authorize, getUserTaskLists);

export default taskRouter;
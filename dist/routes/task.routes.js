import { Router } from "express";
import authorize from "../middlewares/auth.middleware.js";
import { createTask, createTaskList, getATaskList, getAllTasks, updateATaskList, updateATask, deleteTask, deleteTaskList, getTasksByStatus } from "../controllers/task.controller.js";
const taskRouter = Router();
taskRouter.post('/', authorize, createTask);
taskRouter.post('/lists', authorize, createTaskList);
taskRouter.get('/', authorize, getAllTasks);
taskRouter.get('/lists', authorize, getATaskList);
taskRouter.get('/status/:status', authorize, getTasksByStatus);
taskRouter.put('/lists/:id', authorize, updateATaskList);
taskRouter.put('/:id', authorize, updateATask);
taskRouter.delete('/:id', authorize, deleteTask);
taskRouter.delete('/lists/:id', authorize, deleteTaskList);
export default taskRouter;
//# sourceMappingURL=task.routes.js.map
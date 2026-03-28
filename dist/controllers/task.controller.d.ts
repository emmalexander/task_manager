import type { Response, NextFunction } from "express";
export declare const createTask: (req: any, res: Response, next: NextFunction) => Promise<void>;
export declare const createTaskList: (req: any, res: Response, next: NextFunction) => Promise<void>;
export declare const updateATaskList: (req: any, res: Response, next: NextFunction) => Promise<void>;
export declare const updateATask: (req: any, res: Response, next: NextFunction) => Promise<void>;
export declare const deleteTask: (req: any, res: Response, next: NextFunction) => Promise<void>;
export declare const deleteTaskList: (req: any, res: Response, next: NextFunction) => Promise<void>;
export declare const getUserTasksByStatus: (req: any, res: Response, next: NextFunction) => Promise<void>;
export declare const getUserTaskLists: (req: any, res: Response, next: NextFunction) => Promise<void>;
export declare const getUserTasks: (req: any, res: Response, next: NextFunction) => Promise<void>;
export declare const addTaskToFavorite: (req: any, res: Response, next: NextFunction) => Promise<void>;
export declare const removeTaskFromFavorite: (req: any, res: Response, next: NextFunction) => Promise<void>;
export declare const getPendingTasks: (req: any, res: Response, next: NextFunction) => Promise<void>;
export declare const getInProgressTasks: (req: any, res: Response, next: NextFunction) => Promise<void>;
export declare const getCompletedTasks: (req: any, res: Response, next: NextFunction) => Promise<void>;
export declare const updateATaskStatus: (req: any, res: Response, next: NextFunction) => Promise<void>;
export declare const searchTasks: (req: any, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=task.controller.d.ts.map
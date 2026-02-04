import type { Response, NextFunction } from "express";
export declare const createTask: (req: any, res: Response, next: NextFunction) => Promise<void>;
export declare const createTaskList: (req: any, res: Response, next: NextFunction) => Promise<void>;
export declare const updateATaskList: (req: any, res: Response, next: NextFunction) => Promise<void>;
export declare const updateATask: (req: any, res: Response, next: NextFunction) => Promise<void>;
export declare const deleteTask: (req: any, res: Response, next: NextFunction) => Promise<void>;
export declare const deleteTaskList: (req: any, res: Response, next: NextFunction) => Promise<void>;
export declare const getTasksByStatus: (req: any, res: Response, next: NextFunction) => Promise<void>;
export declare const getATaskList: (req: any, res: Response, next: NextFunction) => Promise<void>;
export declare const getAllTasks: (req: any, res: Response, next: NextFunction) => void;
//# sourceMappingURL=task.controller.d.ts.map
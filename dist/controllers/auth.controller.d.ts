import type { Request, Response, NextFunction } from "express";
export declare const signUp: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const signIn: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const refreshToken: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const signOut: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=auth.controller.d.ts.map
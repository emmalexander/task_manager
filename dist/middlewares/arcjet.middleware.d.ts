import type { Request, Response, NextFunction } from "express";
declare const arcjetMiddleware: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export default arcjetMiddleware;
//# sourceMappingURL=arcjet.middleware.d.ts.map
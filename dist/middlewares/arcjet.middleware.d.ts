import type { Response, NextFunction } from "express";
declare const arcjetMiddleware: (req: any, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export default arcjetMiddleware;
//# sourceMappingURL=arcjet.middleware.d.ts.map
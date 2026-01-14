import type { Response, NextFunction } from "express";
declare const authorize: (req: any, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export default authorize;
//# sourceMappingURL=auth.middleware.d.ts.map
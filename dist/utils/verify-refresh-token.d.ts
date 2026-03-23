import jwt from "jsonwebtoken";
declare const verifyRefreshToken: (refreshToken: string) => Promise<jwt.JwtPayload & {
    userId: string;
}>;
export default verifyRefreshToken;
//# sourceMappingURL=verify-refresh-token.d.ts.map
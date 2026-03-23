declare const generateTokens: (user: {
    _id: string | import("mongoose").Types.ObjectId;
}) => Promise<{
    accessToken: string;
    refreshToken: string;
}>;
export default generateTokens;
//# sourceMappingURL=generate-token.d.ts.map
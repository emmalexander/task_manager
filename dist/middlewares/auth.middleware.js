import jwt from 'jsonwebtoken';
import { ACCESS_TOKEN_PRIVATE_KEY } from "../config/env.js";
import User from '../models/user.model.js';
const authorize = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        if (!token)
            return res.status(401).json({ message: 'Unauthorized' });
        const accessSecret = ACCESS_TOKEN_PRIVATE_KEY || 'access-token-secret';
        const decoded = jwt.verify(token, accessSecret);
        const user = await User.findById(decoded.userId);
        if (!user)
            return res.status(401).json({ message: 'Unathorized' });
        req.user = user;
        next();
    }
    catch (error) {
        res.status(401).json({ message: "Unauthorized", error: error.message });
    }
};
export default authorize;
//# sourceMappingURL=auth.middleware.js.map
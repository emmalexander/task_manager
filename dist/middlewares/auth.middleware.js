import jwt from 'jsonwebtoken';
import { JWT_SECRET } from "../config/env.js";
if (!JWT_SECRET)
    throw new Error('JWT_SECRET is not defined');
import User from '../models/user.model.js';
const authorize = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        if (!token)
            return res.status(401).json({ message: 'Unauthorized' });
        let secret = JWT_SECRET || 'some-secret-key';
        const decoded = jwt.verify(token, secret);
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
import User from "../models/user.model.js";
import TaskList from "../models/task-list.model.js";
export const getUsers = async (req, res, next) => {
    try {
        const users = await User.find();
        res.status(200).json({ success: true, data: users });
    }
    catch (error) {
        next(error);
    }
};
export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        if (!user) {
            const error = new Error("User not found");
            res.statusCode = 404;
            throw error;
        }
        const userTaskLists = await TaskList.find({ userId: user._id }).populate('tasks') ?? [];
        const userData = {
            user: user,
            taskLists: userTaskLists,
        };
        res.status(200).json({ success: true, data: userData });
    }
    catch (error) {
        next(error);
    }
};
export const deleteUser = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            const error = new Error("User not found");
            res.statusCode = 404;
            throw error;
        }
        res.status(200).json({ success: true, message: "User deleted successfully" });
    }
    catch (error) {
        next(error);
    }
};
//# sourceMappingURL=user.controller.js.map
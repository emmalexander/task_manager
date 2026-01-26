import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import User from "../models/user.model.js";
import { JWT_SECRET, JWT_EXPIRES_IN } from "../config/env.js";
if (!JWT_SECRET)
    throw new Error('JWT_SECRET is not defined');
if (!JWT_EXPIRES_IN)
    throw new Error('JWT_EXPIRES_IN is not defined');
export const signUp = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { firstName, lastName, phoneNumber, email, password } = req.body;
        const existingUser = await User.findOne({ email, phoneNumber });
        if (existingUser) {
            const message = "User already exists";
            const error = new Error(message);
            res.statusCode = 409;
            throw error;
        }
        // Hash the password
        const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(password, salt);
        // Create a new User
        const newUsers = await User.create([{ firstName, lastName, phoneNumber, email, password: hashPassword }], { session });
        let expireTime = JWT_EXPIRES_IN;
        let secret = JWT_SECRET || 'some-secret-key';
        const token = jwt.sign({ userId: newUsers[0]?._id }, secret, { expiresIn: expireTime });
        await session.commitTransaction();
        session.endSession();
        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: {
                token: token,
                user: newUsers[0]
            }
        });
    }
    catch (error) {
        session.abortTransaction();
        next(error);
    }
};
export const signIn = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            const error = new Error("User does not exist");
            res.statusCode = 404;
            throw error;
        }
        console.log("User found:", user);
        console.log("Password from DB:", user.password);
        console.log("Password from Request:", password);
        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if (!isPasswordValid) {
            const error = new Error("Invalid Password");
            res.statusCode = 401;
            throw error;
        }
        let expireTime = JWT_EXPIRES_IN;
        let secret = JWT_SECRET || 'some-secret-key';
        const token = jwt.sign({ userId: user._id }, secret, { expiresIn: expireTime });
        res.status(200).json({
            success: true,
            message: "User signed in successfully",
            data: {
                user,
                token,
            }
        });
    }
    catch (error) {
        next(error);
    }
};
export const signOut = (req, res, next) => { };
//# sourceMappingURL=auth.controller.js.map
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import type { Request, Response, NextFunction } from "express";

import User from "../models/user.model.js";
import TaskList from "../models/task-list.model.js";
import UserToken from "../models/user-token.model.js";
import generateTokens from "../utils/generate-token.js";
import verifyRefreshToken from "../utils/verify-refresh-token.js";



export const signUp = async (req: Request, res: Response, next: NextFunction)=> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { firstName, lastName, phoneNumber, email, password } = req.body;

        const existingUser = await User.findOne({email, phoneNumber});

        if(existingUser) {
            const message = "User already exists";
            const error: any = new Error(message);
            error.statusCode = 409;
            throw error;
        }

        // Hash the password
        const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(password, salt);

        // Create a new User
        const newUsers = await User.create([{firstName, lastName, phoneNumber, email, password: hashPassword}], { session });
        const createdUserId = (newUsers[0] as any)._id as mongoose.Types.ObjectId;
        const newUserWithOutPassword = await User.findById(newUsers[0]?._id).select("-password");

        // Create a default task list for the user within the same session
        const defaultTaskLists = await TaskList.create([
            {
                name: 'My Tasks',
                description: 'Default task list',
                userId: createdUserId,
                isDefault: true,
            }
        ], { session });
        const defaultTaskList = defaultTaskLists[0];
        //console.log("New User Created:", newUserWithOutPassword);

        const { accessToken, refreshToken } = await generateTokens({ _id: createdUserId });

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: {
                accessToken,
                refreshToken,
                user: newUserWithOutPassword,
                taskList: defaultTaskList,
            }
        });
    } catch(error){
        session.abortTransaction();
        next(error);
    }
};

export const signIn = async (req: Request, res: Response, next: NextFunction)=> {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if(!user){
            const error: any = new Error("User does not exist");
            error.statusCode = 404;
            throw error;
        }

        const userWithoutPassword = await User.findById(user._id).select("-password");

        //console.log("User found:", user);

        //console.log("Password from DB:", user.password);
        //console.log("Password from Request:", password);

        const isPasswordValid = bcrypt.compareSync(password, user.password);

        if(!isPasswordValid){
            const error: any = new Error("Invalid Password");
            error.statusCode = 401;
            throw error;
        }

        const { accessToken, refreshToken } = await generateTokens({ _id: user._id });

        res.status(200).json({
            success: true,
            message: "User signed in successfully",
            data: {
                user: userWithoutPassword,
                accessToken,
                refreshToken,
            }
        });
    } catch(error) {
        next(error);
    }
};

export const refreshToken = async (req: Request, res: Response, next: NextFunction)=> {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            const error: any = new Error("Refresh token is required");
            error.statusCode = 400;
            throw error;
        }

        const decoded = await verifyRefreshToken(refreshToken);
        if (!decoded || !decoded.userId) {
            const error: any = new Error("Invalid refresh token");
            error.statusCode = 401;
            throw error;
        }

        // issue new tokens
        const tokens = await generateTokens({ _id: decoded.userId });

        res.status(200).json({
            success: true,
            message: "Token refreshed successfully",
            data: tokens,
        });
    } catch (error) {
        next(error);
    }
};

export const signOut = async (req: Request, res: Response, next: NextFunction)=> {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            const error: any = new Error("Refresh token is required");
            error.statusCode = 400;
            throw error;
        }

        const tokenRecord = await UserToken.findOne({ token: refreshToken });
        if (!tokenRecord) {
            return res.status(200).json({
                success: true,
                message: "Already signed out or token has been revoked",
            });
        }

        await tokenRecord.deleteOne();

        res.status(200).json({
            success: true,
            message: "Signed out successfully",
        });
    } catch (error) {
        next(error);
    }
};
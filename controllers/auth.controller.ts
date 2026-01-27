import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken'

import type { Request, Response, NextFunction } from "express";
import type { StringValue } from 'ms';

import User  from "../models/user.model.js";

import { JWT_SECRET, JWT_EXPIRES_IN } from "../config/env.js";
if (!JWT_SECRET) throw new Error('JWT_SECRET is not defined');
if (!JWT_EXPIRES_IN) throw new Error('JWT_EXPIRES_IN is not defined');



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
        const newUserWithOutPassword = await User.findById(newUsers[0]?._id).select("-password");
        console.log("New User Created:", newUserWithOutPassword);

        let expireTime: StringValue = JWT_EXPIRES_IN as StringValue;
        let secret: string = JWT_SECRET as string || 'some-secret-key';

        const token = jwt.sign({userId: newUsers[0]?._id}, secret, { expiresIn: expireTime});

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: {
                token: token,
                user: newUserWithOutPassword,  //newUsers[0]
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

        console.log("User found:", user);

        console.log("Password from DB:", user.password);
        console.log("Password from Request:", password);

        const isPasswordValid = bcrypt.compareSync(password, user.password);

        if(!isPasswordValid){
            const error: any = new Error("Invalid Password");
            error.statusCode = 401;
            throw error;
        }

        let expireTime: StringValue = JWT_EXPIRES_IN as StringValue;
        let secret: string = JWT_SECRET as string || 'some-secret-key';

        const token = jwt.sign({userId: user._id}, secret, { expiresIn: expireTime });

        res.status(200).json({
            success: true,
            message: "User signed in successfully",
            data: {
                user,
                token,
            }
        });
    } catch(error) {
        next(error);
    }
};

export const signOut = (req: Request, res: Response, next: NextFunction)=> {};
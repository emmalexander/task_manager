import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import TaskList from "../models/task-list.model.js";
import UserToken from "../models/user-token.model.js";
import transporter, { accountEmail } from "../config/nodemailer.js";
import { emailTemplates } from "../utils/email-template.js";
import generateTokens from "../utils/generate-token.js";
import verifyRefreshToken from "../utils/verify-refresh-token.js";
const create6DigitOTP = () => Math.floor(100000 + Math.random() * 900000).toString();
const OTP_LIFETIME_MINUTES = 10;
const sendEmail = async (to, subject, html) => {
    if (!to)
        throw new Error("Recipient email is required");
    if (process.env.NODE_ENV === 'test') {
        console.log(`[TEST] Email send skipped to ${to} subject ${subject}`);
        return;
    }
    const mailOptions = {
        from: accountEmail,
        to,
        subject,
        html,
    };
    await transporter.sendMail(mailOptions);
};
const sendOTPEmail = async (to, userName, otp, type) => {
    const template = emailTemplates.find((t) => t.label.includes(`${type} otp`));
    if (!template)
        throw new Error(`OTP template for ${type} not found`);
    const mailInfo = {
        userName,
        otp,
        expiryMinutes: OTP_LIFETIME_MINUTES,
    };
    const message = template.generateBody(mailInfo);
    const subject = template.generateSubject(mailInfo);
    await sendEmail(to, subject, message);
};
export const signUp = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { firstName, lastName, phoneNumber, email, password } = req.body;
        const existingUser = await User.findOne({ $or: [{ email }, { phoneNumber }] });
        if (existingUser) {
            const error = new Error("User already exists");
            error.statusCode = 409;
            throw error;
        }
        // Hash the password
        const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(password, salt);
        const otp = create6DigitOTP();
        const otpExpires = new Date(Date.now() + OTP_LIFETIME_MINUTES * 60 * 1000);
        // Create a new User
        const newUsers = await User.create([{
                firstName,
                lastName,
                phoneNumber,
                email,
                password: hashPassword,
                isEmailVerified: false,
                emailVerificationOTP: otp,
                emailVerificationOTPExpires: otpExpires
            }], { session });
        const createdUserId = newUsers[0]._id;
        const newUserWithOutPassword = await User.findById(newUsers[0]?._id).select("-password -emailVerificationOTP -resetPasswordOTP");
        // Create a default task list for the user within the same session
        const defaultTaskLists = await TaskList.create([
            {
                name: 'My Tasks',
                description: 'Default task list',
                userId: createdUserId,
                isDefault: true,
            }
        ], { session });
        await sendOTPEmail(email, firstName, otp, 'verification');
        await session.commitTransaction();
        session.endSession();
        res.status(201).json({
            success: true,
            message: 'User created successfully. Please verify your email using the OTP sent to your inbox.',
            data: {
                user: newUserWithOutPassword,
                taskList: defaultTaskLists[0],
            }
        });
    }
    catch (error) {
        session.abortTransaction();
        next(error);
    }
};
export const verifyEmail = async (req, res, next) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            const error = new Error('Email and OTP are required');
            error.statusCode = 400;
            throw error;
        }
        const user = await User.findOne({ email });
        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }
        if (user.isEmailVerified) {
            return res.status(200).json({ success: true, message: 'Email already verified' });
        }
        if (!user.emailVerificationOTP || !user.emailVerificationOTPExpires || user.emailVerificationOTP !== otp) {
            const error = new Error('Invalid verification code');
            error.statusCode = 400;
            throw error;
        }
        if (new Date() > user.emailVerificationOTPExpires) {
            const error = new Error('Verification code has expired');
            error.statusCode = 400;
            throw error;
        }
        user.isEmailVerified = true;
        user.emailVerificationOTP = null;
        user.emailVerificationOTPExpires = null;
        await user.save();
        const userWithoutPassword = await User.findById(user._id).select('-password -emailVerificationOTP -resetPasswordOTP');
        const { accessToken, refreshToken } = await generateTokens({ _id: user._id });
        res.status(200).json({
            success: true,
            message: 'Email verified successfully',
            data: { user: userWithoutPassword, accessToken, refreshToken }
        });
    }
    catch (error) {
        next(error);
    }
};
export const resendVerificationCode = async (req, res, next) => {
    try {
        const { email } = req.body;
        if (!email) {
            const error = new Error('Email is required');
            error.statusCode = 400;
            throw error;
        }
        const user = await User.findOne({ email });
        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }
        if (user.isEmailVerified) {
            return res.status(200).json({ success: true, message: 'Email already verified' });
        }
        // Check cooldown: 1 minute
        if (user.lastVerificationResend && (Date.now() - user.lastVerificationResend.getTime()) < 60000) {
            const error = new Error('Please wait 1 minute before requesting another verification code');
            error.statusCode = 429;
            throw error;
        }
        const otp = create6DigitOTP();
        const otpExpires = new Date(Date.now() + OTP_LIFETIME_MINUTES * 60 * 1000);
        user.emailVerificationOTP = otp;
        user.emailVerificationOTPExpires = otpExpires;
        user.lastVerificationResend = new Date();
        await user.save();
        await sendOTPEmail(email, user.firstName, otp, 'verification');
        res.status(200).json({ success: true, message: 'Verification code resent to your email' });
    }
    catch (error) {
        next(error);
    }
};
export const requestPasswordReset = async (req, res, next) => {
    try {
        const { email } = req.body;
        if (!email) {
            const error = new Error('Email is required');
            error.statusCode = 400;
            throw error;
        }
        const user = await User.findOne({ email });
        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }
        const otp = create6DigitOTP();
        const otpExpires = new Date(Date.now() + OTP_LIFETIME_MINUTES * 60 * 1000);
        user.resetPasswordOTP = otp;
        user.resetPasswordOTPExpires = otpExpires;
        await user.save();
        await sendOTPEmail(email, user.firstName, otp, 'reset');
        res.status(200).json({ success: true, message: 'Password reset code sent to email' });
    }
    catch (error) {
        next(error);
    }
};
export const verifyPasswordReset = async (req, res, next) => {
    try {
        const { email, otp, newPassword } = req.body;
        if (!email || !otp || !newPassword) {
            const error = new Error('Email, OTP, and new password are required');
            error.statusCode = 400;
            throw error;
        }
        const user = await User.findOne({ email });
        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }
        if (!user.resetPasswordOTP || !user.resetPasswordOTPExpires || user.resetPasswordOTP !== otp) {
            const error = new Error('Invalid password reset code');
            error.statusCode = 400;
            throw error;
        }
        if (new Date() > user.resetPasswordOTPExpires) {
            const error = new Error('Password reset code has expired');
            error.statusCode = 400;
            throw error;
        }
        const salt = bcrypt.genSaltSync(10);
        user.password = bcrypt.hashSync(newPassword, salt);
        user.resetPasswordOTP = null;
        user.resetPasswordOTPExpires = null;
        await user.save();
        res.status(200).json({ success: true, message: 'Password reset successful' });
    }
    catch (error) {
        next(error);
    }
};
export const signIn = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            const error = new Error("User does not exist");
            error.statusCode = 404;
            throw error;
        }
        if (!user.isEmailVerified) {
            const error = new Error("Email not verified. Please verify your email before signing in.");
            error.statusCode = 403;
            throw error;
        }
        const userWithoutPassword = await User.findById(user._id).select("-password -emailVerificationOTP -resetPasswordOTP -emailVerificationOTPExpires -updatedAt -lastVerificationResend");
        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if (!isPasswordValid) {
            const error = new Error("Invalid Password");
            error.statusCode = 401;
            throw error;
        }
        const { accessToken, refreshToken } = await generateTokens({ _id: user._id });
        res.status(200).json({
            success: true,
            message: "User signed in successfully",
            data: {
                user: userWithoutPassword,
                accessToken: accessToken,
                refreshToken: refreshToken,
            }
        });
    }
    catch (error) {
        next(error);
    }
};
export const refreshToken = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            const error = new Error("Refresh token is required");
            error.statusCode = 400;
            throw error;
        }
        const decoded = await verifyRefreshToken(refreshToken);
        if (!decoded || !decoded.userId) {
            const error = new Error("Invalid refresh token");
            error.statusCode = 401;
            throw error;
        }
        const tokens = await generateTokens({ _id: decoded.userId });
        res.status(200).json({
            success: true,
            message: "Token refreshed successfully",
            data: tokens,
        });
    }
    catch (error) {
        next(error);
    }
};
export const signOut = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            const error = new Error("Refresh token is required");
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
    }
    catch (error) {
        next(error);
    }
};
//# sourceMappingURL=auth.controller.js.map
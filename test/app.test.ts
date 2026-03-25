// const app = require("../src/app.js");
import app from "../dist/src/app.js";
import request from "supertest";
import User from "../dist/models/user.model.js";
// const request = require("supertest");
import { initTestEnv } from "./setup";
import registerTaskTests from "./task.test";

// initialize DB connection hooks
initTestEnv();

describe("Welcome message test", () => {
    it("should return welcome message", async () => {
        const res = await request(app).get("/");
        expect(res.statusCode).toEqual(200);
        expect(res.text).toBe("Welcome to Task Manager API");
    });
});

describe("Sign in endpoint test", () => {
    it("should return 200 and a token", async () => {
        const res = await request(app)
            .post("/api/v1/auth/sign-in")
            .send({
                email: "emmanuelohiocheoya@gmail.com",
                password: "Youtube123!@#",
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toHaveProperty("token");
    });
});

describe("Sign up endpoint test", () => {
    it("should return 201 and request email verification", async () => {
        const res = await request(app)
            .post("/api/v1/auth/sign-up")
            .send({
                firstName: "Test",
                lastName: "User",
                phoneNumber: "08012345678",
                email: "emmanuelohiocheoya@gmail.com",
                password: "Youtube123!@#",
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toContain("Please verify your email");
    });
});

describe("Email verification and reset flow", () => {
    const email = "verifyflow@example.com";
    const password = "Youtube123!@#";
    let otp: string;

    it("should sign up user and store OTP", async () => {
        const signupRes = await request(app).post("/api/v1/auth/sign-up").send({
            firstName: "Verify",
            lastName: "Flow",
            phoneNumber: "08023456789",
            email,
            password,
        });
        expect(signupRes.statusCode).toEqual(201);

        const userResp = await request(app).post("/api/v1/auth/resend-verification").send({ email });
        expect(userResp.statusCode).toEqual(200);
    });

    it("should reject sign in before verification", async () => {
        const res = await request(app).post("/api/v1/auth/sign-in").send({ email, password });
        expect(res.statusCode).toEqual(403);
    });

    it("should verify email using OTP from DB", async () => {
        const user = await User.findOne({ email }).select("emailVerificationOTP");
        otp = user?.emailVerificationOTP as string;
        const res = await request(app).post("/api/v1/auth/verify-email").send({ email, otp });
        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(true);
    });

    it("should allow sign in after verification", async () => {
        const res = await request(app).post("/api/v1/auth/sign-in").send({ email, password });
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toHaveProperty("accessToken");
    });

    it("should request password reset and verify with OTP", async () => {
        const createRes = await request(app).post("/api/v1/auth/request-password-reset").send({ email });
        expect(createRes.statusCode).toEqual(200);

        const user = await User.findOne({ email }).select("resetPasswordOTP");
        const resetOtp = user?.resetPasswordOTP as string;

        const verifyRes = await request(app).post("/api/v1/auth/verify-password-reset").send({
            email,
            otp: resetOtp,
            newPassword: "NewYoutube123!@#",
        });

        expect(verifyRes.statusCode).toEqual(200);
    });
});

describe("Sign up existing user endpoint test", () => {
    it("should return 409 if user already exists", async () => {
        const res = await request(app)
            .post("/api/v1/auth/sign-up")
            .send({
                firstName: "Test",
                lastName: "User",
                phoneNumber: "08012345678",
                email: "emmanuelohiocheoya@gmail.com",
                password: "Youtube123!@#",
            });
        expect(res.statusCode).toEqual(409);
        expect(res.body.error).toEqual("User already exists");
    });
});

describe("Sign in non-existing user endpoint test", () => {
    it("should return 404 if user does not exist", async () => {
        const res = await request(app)
            .post("/api/v1/auth/sign-in")
            .send({
                email: "emmanuelohiocheoeeya@gmail.com",
                password: "wrongpassword",
            });
        expect(res.statusCode).toEqual(404);
        expect(res.body.error).toEqual("User does not exist");
    });
});

describe("Sign in with wrong password endpoint test", () => {
    it("should return 401 if password is incorrect", async () => {
        const res = await request(app)
            .post("/api/v1/auth/sign-in")
            .send({
                email: "emmanuelohiocheoya@gmail.com",
                password: "wrongpassword",
            });
        expect(res.statusCode).toEqual(401);
        expect(res.body.error).toEqual("Invalid Password");
    });
});

// register task tests after auth tests are declared
registerTaskTests();


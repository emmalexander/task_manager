// const app = require("../src/app.js");
import app from "../dist/src/app.js";
import request from "supertest";
// const request = require("supertest");
import mongoose from "mongoose";
import { DB_URI } from "../config/env.js";

beforeAll(async () => {
    await mongoose.connect(DB_URI ?? "");
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe("GET /", () => {
    it("should return welcome message", async () => {
        const res = await request(app).get("/");
        expect(res.statusCode).toEqual(200);
        expect(res.text).toBe("Welcome to Task Manager API");
    });
});

// describe("Sign in endpoint test", () => {
//     it("should return 200 and a token", async () => {
//         const res = await request(app)
//             .post("/api/v1/auth/sign-in")
//             .send({
//                 email: "emmanuelohiocheoya@gmail.com",
//                 password: "12345",
//             });
//         expect(res.statusCode).toEqual(200);
//         expect(res.body).toHaveProperty("token");
//     });
// });

describe("Sign up endpoint test", () => {
    it("should return 201 and a token", async () => {
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
        expect(res.body).toHaveProperty("token");
    });
});

// describe("Sign up existing user endpoint test", () => {
//     it("should return 409 if user already exists", async () => {
//         const res = await request(app)
//             .post("/api/v1/auth/sign-up")
//             .send({
//                 firstName: "Test",
//                 lastName: "User",
//                 phoneNumber: "08012345678",
//                 email: "emmanuelohiocheoya@gmail.com",
//                 password: "Youtube123!@#",
//             });
//         expect(res.statusCode).toEqual(409);
//         expect(res.body).toHaveProperty("message", "User already exists");
//     });
// });

// describe("Sign in non-existing user endpoint test", () => {
//     it("should return 404 if user does not exist", async () => {
//         const res = await request(app)
//             .post("/api/v1/auth/sign-in")
//             .send({
//                 email: "emmanuelohiocheoya@gmail.com",
//                 password: "wrongpassword",
//             });
//         expect(res.statusCode).toEqual(404);
//         expect(res.body).toHaveProperty("message", "User does not exist");
//     });
// });

// describe("Sign in with wrong password endpoint test", () => {
//     it("should return 401 if password is incorrect", async () => {
//         const res = await request(app)
//             .post("/api/v1/auth/sign-in")
//             .send({
//                 email: "emmanuelohiocheoya@gmail.com",
//                 password: "wrongpassword",
//             });
//         expect(res.statusCode).toEqual(401);
//         expect(res.body).toHaveProperty("message", "Invalid Password");
//     });
// });
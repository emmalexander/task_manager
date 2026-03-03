import app from "../dist/src/app.js";
import request from "supertest";

export default function registerTaskTests() {
    describe("TEST: Create a task without token", () => {
        it("should return 401 if no token is provided", async () => {
            const res = await request(app)
                .post("/api/v1/tasks")
                .send({
                    title: "Test Task",
                    description: "This is a test task",
                    status: "pending",
                });
            expect(res.statusCode).toEqual(401);
            expect(res.body.error).toEqual("No token provided");
        });
    });

    describe("TEST: Create a task with invalid token", () => {
        it("should return 401 if token is invalid", async () => {
            const res = await request(app)
                .post("/api/v1/tasks")
                .set("Authorization", "Bearer invalidtoken")
                .send({
                    title: "Test Task",
                    description: "This is a test task",
                    status: "pending",
                });
            expect(res.statusCode).toEqual(401);
            expect(res.body.error).toEqual("Invalid token");
        });
    });

    describe("TEST: Create a task with valid token", () => {
        it("should return 201 if task is created successfully", async () => {
            // First, sign in to get a valid token
            const signInRes = await request(app)
                .post("/api/v1/auth/sign-in")
                .send({
                    email: "emmanuelohiocheoya@gmail.com",
                    password: "Youtube123!@#",
                });
            const token = signInRes.body.data.token;

            // Then, create a task with the valid token
            const res = await request(app)
                .post("/api/v1/tasks")
                .set("Authorization", `Bearer ${token}`)
                .send({
                    title: "Test Task",
                    description: "This is a test task",
                });
            expect(res.statusCode).toEqual(201);
            expect(res.body.data).toHaveProperty("id");
            expect(res.body.data.title).toEqual("Test Task");
        });
    });

    describe("TEST: Update a task list", () => {
        it("should return 200 if task list is updated successfully", async () => {
            // First, sign in to get a valid token
            const signInRes = await request(app)
                .post("/api/v1/auth/sign-in")
                .send({
                    email: "emmanuelohiocheoya@gmail.com",
                    password: "Youtube123!@#",
                });
            const token = signInRes.body.data.token;

            // Then, create a task list with the valid token
            const createListRes = await request(app)
                .post("/api/v1/tasks/lists")
                .set("Authorization", `Bearer ${token}`)
                .send({
                    name: "Test Task List",
                    description: "This is a test task list",
                });
            const listId = createListRes.body.data._id;

            // Finally, update the task list
            const res = await request(app)
                .put(`/api/v1/tasks/lists/${listId}`)
                .set("Authorization", `Bearer ${token}`)
                .send({
                    name: "Updated Test Task List",
                    description: "This is an updated test task list",
                });
            expect(res.statusCode).toEqual(200);
            expect(res.body.data.name).toEqual("Updated Test Task List");
        });
    });

    describe("TEST: Update a task", () => {
        it("should return 200 if task is updated successfully", async () => {
            // First, sign in to get a valid token
            const signInRes = await request(app)
                .post("/api/v1/auth/sign-in")
                .send({
                    email: "emmanuelohiocheoya@gmail.com",
                    password: "Youtube123!@#",
                });
            const token = signInRes.body.data.token;

            // Then, create a task with the valid token
            const createTaskRes = await request(app)
                .post("/api/v1/tasks")
                .set("Authorization", `Bearer ${token}`)
                .send({
                    title: "Task to Update",
                    description: "This task will be updated",
                    status: "pending",
                });
            const taskId = createTaskRes.body.data._id;

            // Finally, update the task
            const res = await request(app)
                .put(`/api/v1/tasks/${taskId}`)
                .set("Authorization", `Bearer ${token}`)
                .send({
                    title: "Updated Task Title",
                    description: "This task has been updated",
                    status: "completed",
                });
            expect(res.statusCode).toEqual(200);
            expect(res.body.data.title).toEqual("Updated Task Title");
            expect(res.body.data.status).toEqual("completed");
        });
    });

    describe("TEST: Delete a task", () => {
        it("should return 200 if task is deleted successfully", async () => {
            // First, sign in to get a valid token
            const signInRes = await request(app)
                .post("/api/v1/auth/sign-in")
                .send({
                    email: "emmanuelohiocheoya@gmail.com",
                    password: "Youtube123!@#",
                });
            const token = signInRes.body.data.token;

            // Then, create a task with the valid token
            const createTaskRes = await request(app)
                .post("/api/v1/tasks")
                .set("Authorization", `Bearer ${token}`)
                .send({
                    title: "Task to Delete",
                    description: "This task will be deleted",
                });
            const taskId = createTaskRes.body.data.id;

            // Finally, delete the task
            const res = await request(app)
                .delete(`/api/v1/tasks/${taskId}`)
                .set("Authorization", `Bearer ${token}`);
            expect(res.statusCode).toEqual(200);
            expect(res.body.message).toEqual("Task deleted successfully");
        });
    });

    describe("TEST: Delete a task list", () => {
        it("should return 200 if task list is deleted successfully", async () => {
            // First, sign in to get a valid token
            const signInRes = await request(app)
                .post("/api/v1/auth/sign-in")
                .send({
                    email: "emmanuelohiocheoya@gmail.com",
                    password: "Youtube123!@#",
                });
            const token = signInRes.body.data.token;

            // Then, create a task list with the valid token
            const createListRes = await request(app)
                .post("/api/v1/tasks/lists")
                .set("Authorization", `Bearer ${token}`)
                .send({
                    name: "Task List to Delete",
                    description: "This task list will be deleted",
                });
            const listId = createListRes.body.data._id;

            // Finally, delete the task list
            const res = await request(app)
                .delete(`/api/v1/tasks/lists/${listId}`)
                .set("Authorization", `Bearer ${token}`);
            expect(res.statusCode).toEqual(200);
            expect(res.body.message).toEqual("Task list and associated tasks deleted successfully");
        });
    });
}

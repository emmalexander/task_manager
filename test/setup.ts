import mongoose from "mongoose";
import { DB_URI } from "../config/env.js";

export function initTestEnv() {
    beforeAll(async () => {
        await mongoose.connect(DB_URI ?? "");
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });
}

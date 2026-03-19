import mongoose from "mongoose";
import { DB_URI } from "../config/env.js";

export function initTestEnv() {
    beforeAll(async () => {
        process.env.ARCJET_ENV = 'development';
        await mongoose.connect(DB_URI ?? "");
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    beforeEach(async () => {
        // Clean all collections
        const collections = mongoose.connection.collections;
        for (const key in collections) {
            await collections[key].deleteMany({});
        }
    });
}

import { faker } from '@faker-js/faker';
import mongoose from "mongoose";
import "dotenv/config";
const { Schema, model } = mongoose;

const url = "mongodb://localhost:27017/";
const dbName = "your_database_name"; // Replace with your actual database name
const collectionName = "api_logs"; // Replace with your actual collection name

async function seedDatabase() {
    try {
        mongoose.connect(process.env.mongoURI);
        console.log("Connected to MongoDB");

        const ApiLogSchema = new Schema({
            userId: { type: String, required: true },
            timestamp: { type: Date, default: Date.now },
            status: { type: String, enum: ["Success", "Failure"], required: true },
            error: String,
            request: Object,
            response: Object,
        });
        const ApiLog = model("ApiLog", ApiLogSchema);

        const start_date = new Date(2023, 8, 1); // Note: Month is 0-based (9 = October)
        const end_date = new Date(2023, 10, 10); // Replace with your desired end date

        let current_date = new Date(start_date);
        const user_names = Array.from({length: 50}, () => faker.internet.userName());

        while (current_date <= end_date) {
            for (let i = 0; i < 100; i++) {
                // Generate 100 logs per day (adjust as needed)
                const userId = faker.helpers.arrayElement(user_names);
                const status = faker.helpers.arrayElement(["Success", "Failure"]);
                const error = status === "Failure" ? faker.lorem.text() : null;
                const request = {
                    query: { userId },
                    headers: {
                        host: faker.internet.url(),
                        connection: "keep-alive",
                        "cache-control": "max-age=0",
                    },
                };
                const response = status === "Success" ? { message: "Hello, World!" } : null;

                // Generate a random timestamp within the current day
                const timestamp = faker.date.between(
                    current_date,
                    new Date(current_date.getTime() + 24 * 60 * 60 * 1000)
                );

                const log_entry = {
                    userId,
                    timestamp: new Date(timestamp),
                    status,
                    error,
                    request,
                    response,
                };
                // console.log(log_entry);
                const log = new ApiLog(log_entry);
                await log.save();
            }

            current_date.setDate(current_date.getDate() + 1);
        }

        console.log("Database seeded successfully.");
    } finally {
        await mongoose.disconnect();
    }
}

seedDatabase();

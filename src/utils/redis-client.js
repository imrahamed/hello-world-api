import * as redis from "redis";
import "dotenv/config";

const client = redis.createClient({
    url: process.env.redisURI,
});

client.on("connect", () => {
    console.log("Connected to Redis");
});

client.on("error", (err) => {
    console.error("Error connecting to Redis:", err);
});

export default client;

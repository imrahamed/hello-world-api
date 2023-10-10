import express from "express";
import mongoose from "mongoose";
import apiRoutes from "./src/routes/apiRoutes.js";
import "dotenv/config";
import redisClient from "./src/utils/redis-client.js";

const app = express();

mongoose.connect(process.env.mongoURI);
await redisClient.connect();

app.use("/api", apiRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

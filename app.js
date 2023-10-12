import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import apiRoutes from "./src/routes/apiRoutes.js";
import "dotenv/config";
import redisClient from "./src/utils/redis-client.js";
import swaggerUi from "swagger-ui-express"
import swaggerDocument from "./sawgger.json"  assert { type: 'json' };

const app = express();

mongoose.set('debug', true);
mongoose.connect(process.env.mongoURI);
await redisClient.connect();

app.use(cors())
app.use("/api", apiRoutes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

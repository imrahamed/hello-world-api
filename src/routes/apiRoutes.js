/**
 * Routes for handling API endpoints.
 * @module apiRoutes
 */

import express from "express";
import { getCounts, getGraphData, getHelloWorld, getLogs } from "../controllers/apiController.js";
import validateTimeRange from "../middlewares/validationMiddleware.js";

const router = express.Router();

router.get("/helloWorld", getHelloWorld);
router.get("/analytics/logs", validateTimeRange, getLogs);
router.get("/analytics/counts", validateTimeRange, getCounts);
router.get("/analytics/graphData", validateTimeRange, getGraphData);

export default router;

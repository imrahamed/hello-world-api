/**
 * Controller for handling API requests.
 * @module apiController
 */

import * as apiService from "../services/apiService.js";
import redisClient from "../utils/redis-client.js";

/**
 * Get a "Hello World" message.
 * @function
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {function} next - Express next middleware function.
 * @throws {Error} Throws an error if an unexpected error occurs.
 */
const getHelloWorld = async (req, res, next) => {
    try {
        const { userId } = req.query;

        if (!userId) {
            return res.status(400).json({ error: "User ID is required." });
        }

        const isFailure = Math.random() < 0.2; // 20% chance of failure

        if (isFailure) {
            const error = "Internal Server Error";
            await apiService.logRequest(
                userId,
                "Failure",
                { headers: req.headers, body: req.body, query: req.query },
                {
                    status: 500,
                    error,
                },
                "Random failure occurred."
            );
            return res.status(500).json({ error });
        }
        const message = "Hello, World!";
        await apiService.logRequest(
            userId,
            "Success",
            { headers: req.headers, body: req.body, query: req.query },
            { status: 200, message },
            null
        );

        res.status(200).json({ message });
    } catch (error) {
        next(error);
    }
};

/**
 * Get paginated logs within a specified time range and filter.
 * @function
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {function} next - Express next middleware function.
 * @returns {Promise<void>} A Promise that resolves once the logs are retrieved and sent in the response.
 * @throws {Error} Throws an error if an unexpected error occurs.
 */
const getLogs = async (req, res, next) => {
    try {
        const { fromTimestamp, toTimestamp, filter, page, pageSize } = req.query;

        const logs = await apiService.getLogs(
            fromTimestamp,
            toTimestamp,
            filter && JSON.parse(filter),
            parseInt(page),
            parseInt(pageSize)
        );

        res.json({ logs });
    } catch (error) {
        next(error);
    }
};

/**
 * Get counts of various metrics within a specified time range.
 * @function
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {function} next - Express next middleware function.
 * @returns {Promise<void>} A Promise that resolves once the counts are retrieved and sent in the response.
 * @throws {Error} Throws an error if an unexpected error occurs.
 */
const getCounts = async (req, res, next) => {
    try {
        const { fromTimestamp, toTimestamp } = req.query;

        const totalFailures = await apiService.getTotalFailures(fromTimestamp, toTimestamp);
        const totalCalls = await apiService.getTotalCalls(fromTimestamp, toTimestamp);
        const totalUniqueUsers = await apiService.getTotalUniqueUsers(fromTimestamp, toTimestamp);

        res.json({
            totalFailures,
            totalCalls,
            totalUniqueUsers,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get Graph data.
 * @function
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {function} next - Express next middleware function.
 * @returns {Promise<void>} A Promise that resolves once the graph data is retrieved and sent in the response.
 * @throws {Error} Throws an error if an unexpected error occurs.
 */
const getGraphData = async (req, res, next) => {
    try {
        const { fromTimestamp, toTimestamp } = req.query;
        const cacheKey = `graphData:${fromTimestamp}:${toTimestamp}`;
        // Try to get data from Redis cache
        const cachedData = await redisClient.get(cacheKey);
        const currentDate = new Date().valueOf();
        if (cachedData && toTimestamp < currentDate) {
            const logs = JSON.parse(cachedData);
            res.json({ logs });
        } else {
            // If data is not in cache, fetch it from the database
            const logs = await apiService.getGraphData(fromTimestamp, toTimestamp);

            // Store data in Redis cache for future requests
            await redisClient.setEx(cacheKey, 600, JSON.stringify(logs));
            res.json({ logs });
        }
    } catch (error) {
        next(error);
    }
};
export { getHelloWorld, getLogs, getCounts, getGraphData };

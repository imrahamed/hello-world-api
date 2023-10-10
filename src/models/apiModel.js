/**
 * Model for interacting with the API logs.
 * @module apiModel
 */

import mongoose from "mongoose";

const { Schema, model } = mongoose;

/**
 * Represents an API log entry.
 * @typedef {Object} ApiLog
 * @property {string} userId - The user ID associated with the request.
 * @property {Date} timestamp - The timestamp of the request.
 * @property {string} status - The status of the request (Success or Failure).
 * @property {string} [error] - The error message (if any).
 * @property {Object} [request] - The request object.
 * @property {Object} [response] - The response object.
 */

const ApiLogSchema = new Schema({
    userId: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    status: { type: String, enum: ["Success", "Failure"], required: true },
    error: String,
    request: Object,
    response: Object,
});

const ApiLog = model("ApiLog", ApiLogSchema);

/**
 * Log a request to the database.
 * @function
 * @async
 * @param {string} userId - The user ID associated with the request.
 * @param {string} status - The status of the request (Success or Failure).
 * @param {string} [error] - The error message (if any).
 * @throws {Error} Throws an error if an unexpected error occurs.
 */
const logRequest = async (userId, status, request, response, error) => {
    try {
        const log = new ApiLog({
            userId,
            status,
            request,
            response,
            error,
        });
        await log.save();
    } catch (error) {
        console.error(error);
    }
};

/**
 * Get the total number of unique users.
 * @function
 * @async
 * @returns {number} The total number of unique users.
 */
const getTotalUniqueUsers = async (fromTimestamp, toTimestamp) => {
    const where = formTimeRangePayload(fromTimestamp, toTimestamp);
    console.log(where);
    const totalUniqueUsers = await ApiLog.distinct("userId", where).exec();
    return totalUniqueUsers.length;
};

/**
 * Get the total number of API calls.
 * @function
 * @async
 * @returns {number} The total number of API calls.
 */
const getTotalCalls = async (fromTimestamp, toTimestamp) => {
    const where = formTimeRangePayload(fromTimestamp, toTimestamp);
    const totalCalls = await ApiLog.countDocuments(where).exec();
    return totalCalls;
};

/**
 * Get the total number of API failures.
 * @function
 * @async
 * @returns {number} The total number of API failures.
 */
const getTotalFailures = async (fromTimestamp, toTimestamp) => {
    const where = formTimeRangePayload(fromTimestamp, toTimestamp);
    where.status = "Failure";
    const totalFailures = await ApiLog.countDocuments(where).exec();
    return totalFailures;
};

/**
 * Get paginated logs within a specified time range and filter.
 * @function
 * @async
 * @param {Date} fromTimestamp - The start of the time range.
 * @param {Date} toTimestamp - The end of the time range.
 * @param {Object} filter - The filter object to apply.
 * @param {number} page - The page number.
 * @param {number} pageSize - The number of logs per page.
 * @returns {ApiLog[]} An array of API log entries.
 */
const getLogs = async (fromTimestamp, toTimestamp, filter, page, pageSize) => {
    const where = formTimeRangePayload(fromTimestamp, toTimestamp);
    if (filter) {
        if (filter.status) {
            where.status = filter.status;
        }
    }
    const logs = await ApiLog.find(where)
        .sort({ timestamp: 1 })
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .exec();

    return logs;
};

/**
 * Get aggregated logs grouped by time intervals within a specified time range and filter.
 * @function
 * @async
 * @param {Date} fromTimestamp - The start of the time range.
 * @param {Date} toTimestamp - The end of the time range.
 * @returns {Array} An array of aggregated logs.
 */
const getAggregatedLogs = async (fromTimestamp, toTimestamp) => {
    const match = formTimeRangePayload(fromTimestamp, toTimestamp);

    const durationInMilliseconds = toTimestamp - fromTimestamp;
    const interval = calculateInterval(durationInMilliseconds);

    const groupBy = {
        $group: {
            _id: {
                $dateToString: {
                    date: "$timestamp",
                    format: getDateFormat(interval),
                },
            },
            count: { $sum: 1 },
            successCount: { $sum: { $cond: [{ $eq: ["$status", "Success"] }, 1, 0] } },
            failureCount: { $sum: { $cond: [{ $eq: ["$status", "Failure"] }, 1, 0] } },
            userCount: { $addToSet: "$userId" },
        },
    };

    const aggregatedLogs = await ApiLog.aggregate([{ $match: match }, groupBy]);

    return aggregatedLogs;
};

/**
 * Calculates the interval based on the provided duration in milliseconds.
 * @param {number} durationInMilliseconds - The duration in milliseconds.
 * @returns {string} The interval ("minute", "5_minutes", "hour", or "day").
 */
const calculateInterval = (durationInMilliseconds) => {
    if (durationInMilliseconds <= 600000) {
        return "minute";
    } else if (durationInMilliseconds <= 3600000) {
        return "5_minutes";
    } else if (durationInMilliseconds <= 86400000) {
        return "hour";
    } else {
        return "day";
    }
};

/**
 * Gets the date format based on the specified interval.
 * @param {string} interval - The interval ("5_minutes", "hour", or "day").
 * @returns {string} The date format string.
 */
const getDateFormat = (interval) => {
    switch (interval) {
        case "5_minutes":
            return `%Y-%m-%d %H:%M5`;
        case "hour":
            return `%Y-%m-%d %H:00`;
        case "day":
            return `%Y-%m-%d`;
        default:
            return `%Y-%m-%d %H:%M`;
    }
};

/**
 * Forms a time range payload for querying logs.
 * @param {number} fromTimestamp - The start of the time range.
 * @param {number} toTimestamp - The end of the time range.
 * @returns {Object} The time range payload.
 */
const formTimeRangePayload = (fromTimestamp, toTimestamp) => {
    const where = {};

    if (fromTimestamp && toTimestamp) {
        where.timestamp = {
            $gte: new Date(+fromTimestamp),
            $lte: new Date(+toTimestamp),
        };
    }
    return where;
};

export { logRequest, getTotalUniqueUsers, getTotalCalls, getTotalFailures, getLogs, getAggregatedLogs };

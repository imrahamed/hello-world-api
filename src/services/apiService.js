/**
 * Service for interacting with the API logs.
 * @module apiService
 */

import * as apiModel from "../models/apiModel.js";

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
        await apiModel.logRequest(userId, status, request, response, error);
    } catch (error) {
        console.error(error);
    }
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
    const logs = await apiModel.getLogs(fromTimestamp, toTimestamp, filter, page, pageSize);
    return logs;
};

/**
 * Get the total number of unique users.
 * @function
 * @async
 * @returns {number} The total number of unique users.
 */
const getTotalUniqueUsers = async (fromTimestamp, toTimestamp) => {
    const totalUniqueUsers = await apiModel.getTotalUniqueUsers(fromTimestamp, toTimestamp);
    return totalUniqueUsers;
};

/**
 * Get the total number of API calls.
 * @function
 * @async
 * @returns {number} The total number of API calls.
 */
const getTotalCalls = async (fromTimestamp, toTimestamp) => {
    const totalCalls = await apiModel.getTotalCalls(fromTimestamp, toTimestamp);
    return totalCalls;
};

/**
 * Get the total number of API failures.
 * @function
 * @async
 * @returns {number} The total number of API failures.
 */
const getTotalFailures = async (fromTimestamp, toTimestamp) => {
    const totalFailures = await apiModel.getTotalFailures(fromTimestamp, toTimestamp);
    return totalFailures;
};

/**
 * Get counts of various metrics within a specified time range.
 * @function
 * @async
 * @param {Date} fromTimestamp - The start of the time range.
 * @param {Date} toTimestamp - The end of the time range.
 * @returns {Promise<Object>} An object containing the counts of various metrics.
 * @throws {Error} Throws an error if an unexpected error occurs.
 */
const getCounts = async (fromTimestamp, toTimestamp) => {
    const totalFailures = await apiModel.getTotalFailures(fromTimestamp, toTimestamp);
    const totalCalls = await apiModel.getTotalCalls(fromTimestamp, toTimestamp);
    const totalUniqueUsers = await apiModel.getTotalUntotalUniqueUsers(fromTimestamp, toTimestamp);
    return [
        {
            name: "Users",
            value: totalUniqueUsers,
        },
        {
            name: "Total API calls",
            value: totalCalls,
        },
        {
            name: "Failed API calls",
            value: totalFailures,
        },
    ];
};

const getGraphData = async (fromTimestamp, toTimestamp) => {
    const aggregatedLogs = await apiModel.getAggregatedLogs(fromTimestamp, toTimestamp);
    aggregatedLogs.sort(function (a, b) {
        return new Date(a._id) - new Date(b._id);
    });
    const usersData = [];
    const successData = [];
    const failureData = [];

    for (const log of aggregatedLogs) {
        usersData.push({
            name: log._id,
            value: log.userCount.length,
        });
        successData.push({
            name: log._id,
            value: log.successCount,
        });
        failureData.push({
            name: log._id,
            value: log.failureCount,
        });
    }

    const data = [
        {
            name: "Users",
            series: usersData,
        },
        {
            name: "Success",
            series: successData,
        },
        {
            name: "Failures",
            series: failureData,
        },
    ];
    console.log(data);
    return data;
};

export { logRequest, getTotalUniqueUsers, getTotalCalls, getTotalFailures, getLogs, getCounts, getGraphData };

/**
 * Middleware for validating time range.
 * @module validationMiddleware
 */

/**
 * Validate the time range provided in the request query.
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {function} next - Express next middleware function.
 */
const validateTimeRange = (req, res, next) => {
    let { fromTimestamp, toTimestamp } = req.query;
    fromTimestamp = +fromTimestamp;
    toTimestamp = +toTimestamp;
    console.log(fromTimestamp, toTimestamp);
    if (!fromTimestamp || !toTimestamp) {
        return res.status(400).json({ error: "Both fromTimestamp and toTimestamp are required." });
    }

    const fromTime = new Date(fromTimestamp);
    const toTime = new Date(toTimestamp);
    console.log(fromTime, toTime);
    if (isNaN(fromTime) || isNaN(toTime) || fromTime > toTime) {
        return res.status(400).json({ error: "Invalid time range." });
    }

    next();
};

export default validateTimeRange;

import { getHelloWorld, getLogs, getCounts, getGraphData } from "../src/controllers/apiController";
import * as apiService from "../src/services/apiService";
import redisClient from "../src/utils/redis-client";

jest.mock("../src/services/apiService");
jest.mock("../src/utils/redis-client");

describe("apiController", () => {
    let req;
    let res;
    let next;

    beforeEach(() => {
        req = {
            query: {},
            body: {},
            headers: {},
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        next = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("getHelloWorld", () => {
        it("returns a 400 status code if no userId is provided", async () => {
            await getHelloWorld(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: "User ID is required." });
        });
    });

    describe("getLogs", () => {
        it("returns logs", async () => {
            const mockLogs = [
                { id: 1, message: "log1" },
                { id: 2, message: "log2" },
            ];
            apiService.getLogs.mockResolvedValue(mockLogs);

            await getLogs(req, res, next);

            expect(res.json).toHaveBeenCalledWith(mockLogs);
        });
    });

    describe("getCounts", () => {
        it("returns counts", async () => {
            const mockCounts = [
                { name: "Users", value: 5 },
                { name: "Total API calls", value: 20 },
                { name: "Failed API calls", value: 10 },
            ];
            apiService.getTotalFailures.mockResolvedValue(mockCounts[2].value);
            apiService.getTotalCalls.mockResolvedValue(mockCounts[1].value);
            apiService.getTotalUniqueUsers.mockResolvedValue(mockCounts[0].value);

            await getCounts(req, res, next);

            expect(res.json).toHaveBeenCalledWith(mockCounts);
        });
    });

    describe("getGraphData", () => {
        it("fetches graph data from the database and stores it in cache if not available in cache", async () => {
            const mockGraphData = {
                labels: ["2023-10-10 06:00"],
                datasets: [
                    {
                        label: "Users",
                        data: [1],
                        fill: false,
                        borderColor: "rgb(75, 192, 192)",
                        tension: 0.1,
                    },
                    {
                        label: "Successful API Calls",
                        data: [1],
                        fill: false,
                        borderColor: "rgb(75, 192, 192)",
                        tension: 0.1,
                    },
                    {
                        label: "Failure API Calls",
                        data: [0],
                        fill: false,
                        borderColor: "rgb(75, 192, 192)",
                        tension: 0.1,
                    },
                ],
            };
            redisClient.get.mockResolvedValue(null);
            apiService.getGraphData.mockResolvedValue(mockGraphData);

            await getGraphData(req, res, next);

            expect(redisClient.setEx).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith({ logs: mockGraphData });
        });
    });
});

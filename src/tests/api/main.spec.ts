import { expect } from 'chai';
import { startServer, AppServer } from '../../server';
import request from "supertest";
import { config, setupEnvironment } from '../../config/environment';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { readFileSync as originalReadFileSync } from 'fs';

describe('API tests', () => {
    let serverInstance: AppServer;
    process.env.NODE_ENV = 'test';
    const originalReadFileSync = require('fs').readFileSync;
    let mongoServer: MongoMemoryServer;

    before(async () => {

        mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();
        await mongoose.connect(mongoUri);

        const file = {
            "endpoint": "https://test.com",
            "serviceKey": "789456123",
            "secretKey": "789456123",
            "catalogUri": "https://test.com",
            "contractUri": "https://test.com",
            "consentUri": "https://test.com",
        }

        require('fs').readFileSync = () => JSON.stringify(file);
        setupEnvironment();
        serverInstance = await startServer(config.port);
    });

    after(async () => {
        require('fs').readFileSync = originalReadFileSync;
        serverInstance.server.close();
        console.log("Server closed");
        await mongoose.connection.close();
        await mongoServer.stop();
    });

    describe("GET /health", () => {
        it("Should respond with OK and 200 status code", async () => {
            const response = await request(serverInstance.app).get("/health");
            expect(response.status).equal(200, "Status should be 200");
            expect(response.text).equal("OK", "Value is OK");
        })
    });
});

import axios from "axios";
import { PolicyFetcher } from "../../access-control/PolicyFetcher";
import { expect } from "chai";
import app from "./utils/serviceProvider";

axios.defaults.baseURL = "";

const SERVER_PORT = 9090;
const fetcher = new PolicyFetcher({
    count: {
        url: `http://localhost:${SERVER_PORT}/data`,
        option: { remoteValue: "context.count" },
    },
});

describe("Access control testing", () => {
    before(async () => {
        await app.startServer(SERVER_PORT);
    });
    it("Should get a 'count' value from the distant server", async () => {
        const count = await fetcher.context.count();
        expect(count).to.be.equal(5);
    });
});

const fs = require("fs");
const path = require("path");
const request = require("supertest");
const express = require("express");
const fileRoutes = require("../routes/files");

const app = express();
app.use("/files", fileRoutes);

describe("File API Integration", () => {
    let keys = {};
    const testFilePath = path.join(__dirname, "test.txt");

    beforeAll(() => {
        fs.writeFileSync(testFilePath, "Hello integration test!");
    });

    afterAll(() => {
        if (fs.existsSync(testFilePath)) fs.unlinkSync(testFilePath);
    });

    it("should upload a file", async () => {
        const res = await request(app)
            .post("/files")
            .attach("file", testFilePath);
        expect(res.status).toBe(200);
        expect(res.body.publicKey).toBeDefined();
        expect(res.body.privateKey).toBeDefined();
        keys = res.body;
    });

    it("should download the file", async () => {
        const res = await request(app).get(`/files/${keys.publicKey}`);
        expect(res.status).toBe(200);
    });

    it("should delete the file", async () => {
        const res = await request(app).delete(`/files/${keys.privateKey}`);
        expect(res.status).toBe(200);
        expect(res.body.message).toBe("File deleted successfully");
    });
});

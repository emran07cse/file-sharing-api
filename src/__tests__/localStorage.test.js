const fs = require("fs");
const path = require("path");
const LocalStorage = require("../storage/localStorage"); // corrected path

const FOLDER = path.join(__dirname, "../uploads");

// Ensure upload folder exists for tests
beforeAll(() => {
    if (!fs.existsSync(FOLDER)) {
        fs.mkdirSync(FOLDER, { recursive: true });
    }
});

describe("LocalStorage", () => {
    it("should save and retrieve a file", async () => {
        const fakeFile = {
            originalname: "hello.txt",
            path: path.join(FOLDER, "tempfile.txt")
        };

        // create a dummy file for testing
        fs.writeFileSync(fakeFile.path, "Hello world!");

        const { publicKey, privateKey } = await LocalStorage.saveFile(fakeFile);
        const filePath = await LocalStorage.getFile(publicKey);

        expect(fs.existsSync(filePath)).toBe(true);

        const deleted = await LocalStorage.deleteFile(privateKey);
        expect(deleted).toBe(true);
    });
});

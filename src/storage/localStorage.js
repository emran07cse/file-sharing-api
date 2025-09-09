const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const FOLDER = process.env.FOLDER || path.join(__dirname, "../../uploads");

// Ensure upload folder exists
if (!fs.existsSync(FOLDER)) {
    fs.mkdirSync(FOLDER, { recursive: true });
}

class LocalStorage {
    static async saveFile(file) {
        const publicKey = uuidv4();
        const privateKey = uuidv4();

        const newPath = path.join(FOLDER, publicKey + path.extname(file.originalname));
        fs.renameSync(file.path, newPath);

        // Save mapping (in real DB; here JSON)
        const metaPath = path.join(FOLDER, `${publicKey}.json`);
        fs.writeFileSync(
            metaPath,
            JSON.stringify({ publicKey, privateKey, filename: newPath })
        );

        return { publicKey, privateKey };
    }

    static async getFile(publicKey) {
        const metaPath = path.join(FOLDER, `${publicKey}.json`);
        if (!fs.existsSync(metaPath)) return null;

        const meta = JSON.parse(fs.readFileSync(metaPath));
        return meta.filename;
    }

    static async deleteFile(privateKey) {
        const files = fs.readdirSync(FOLDER).filter(f => f.endsWith(".json"));

        for (const file of files) {
            const meta = JSON.parse(fs.readFileSync(path.join(FOLDER, file)));
            if (meta.privateKey === privateKey) {
                fs.unlinkSync(meta.filename);
                fs.unlinkSync(path.join(FOLDER, file));
                return true;
            }
        }
        return false;
    }
}

module.exports = LocalStorage;

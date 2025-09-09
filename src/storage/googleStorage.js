const { Storage } = require("@google-cloud/storage");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

let storage, bucket;

class GoogleStorage {
    static init() {
        const configPath = process.env.CONFIG;
        if (!configPath) throw new Error("CONFIG environment variable required");

        const config = JSON.parse(fs.readFileSync(path.resolve(configPath)));

        storage = new Storage({
            projectId: config.projectId,
            keyFilename: config.keyFilename
        });

        bucket = storage.bucket(config.bucketName);
    }

    static async saveFile(file) {
        if (!bucket) this.init();

        const publicKey = uuidv4();
        const privateKey = uuidv4();

        const destination = `${publicKey}${path.extname(file.originalname)}`;
        await bucket.upload(file.path, { destination });

        // store metadata in GCS as a JSON file
        const metaFile = `${publicKey}.json`;
        const metadata = { publicKey, privateKey, filename: destination };
        await bucket.file(metaFile).save(JSON.stringify(metadata));

        return { publicKey, privateKey };
    }

    static async getFile(publicKey) {
        if (!bucket) this.init();

        const metaFile = `${publicKey}.json`;
        const [exists] = await bucket.file(metaFile).exists();
        if (!exists) return null;

        const [contents] = await bucket.file(metaFile).download();
        const meta = JSON.parse(contents.toString());

        return bucket.file(meta.filename).createReadStream();
    }

    static async deleteFile(privateKey) {
        if (!bucket) this.init();

        const [files] = await bucket.getFiles({ prefix: "" });
        for (const f of files) {
            if (f.name.endsWith(".json")) {
                const [contents] = await f.download();
                const meta = JSON.parse(contents.toString());

                if (meta.privateKey === privateKey) {
                    await bucket.file(meta.filename).delete();
                    await bucket.file(f.name).delete();
                    return true;
                }
            }
        }
        return false;
    }
}

module.exports = GoogleStorage;

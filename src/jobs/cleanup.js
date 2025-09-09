const fs = require("fs");
const path = require("path");

const FOLDER = process.env.FOLDER || path.join(__dirname, "../../uploads");
const CLEANUP_DAYS = process.env.CLEANUP_DAYS || 7; // default 7 days

function cleanup() {
    const files = fs.readdirSync(FOLDER).filter(f => f.endsWith(".json"));

    for (const metaFile of files) {
        const metaPath = path.join(FOLDER, metaFile);
        const meta = JSON.parse(fs.readFileSync(metaPath));

        const lastAccess = fs.statSync(meta.filename).atimeMs; // last accessed time
        const ageDays = (Date.now() - lastAccess) / (1000 * 60 * 60 * 24);

        if (ageDays > CLEANUP_DAYS) {
            try {
                fs.unlinkSync(meta.filename);
                fs.unlinkSync(metaPath);
                console.log(`🧹 Deleted inactive file: ${meta.filename}`);
            } catch (err) {
                console.error("Cleanup failed:", err.message);
            }
        }
    }
}

const cleanupInterval = setInterval(cleanup, 24 * 60 * 60 * 1000); //run daily
cleanupInterval.unref();
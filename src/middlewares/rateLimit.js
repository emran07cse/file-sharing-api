const limits = {};
const UPLOAD_LIMIT = process.env.UPLOAD_LIMIT || 10;   // max uploads per day
const DOWNLOAD_LIMIT = process.env.DOWNLOAD_LIMIT || 20; // max downloads per day

function resetCounts() {
    for (const ip in limits) {
        limits[ip] = { uploads: 0, downloads: 0, lastReset: Date.now() };
    }
}
const interval = setInterval(resetCounts, 24 * 60 * 60 * 1000);
interval.unref(); // allows process to exit cleanly
module.exports = function (action) {
    return (req, res, next) => {
        const ip = req.ip;
        if (!limits[ip]) {
            limits[ip] = { uploads: 0, downloads: 0, lastReset: Date.now() };
        }

        if (action === "upload") {
            if (limits[ip].uploads >= UPLOAD_LIMIT) {
                return res.status(429).json({ error: "Daily upload limit reached" });
            }
            limits[ip].uploads++;
        }

        if (action === "download") {
            if (limits[ip].downloads >= DOWNLOAD_LIMIT) {
                return res.status(429).json({ error: "Daily download limit reached" });
            }
            limits[ip].downloads++;
        }

        next();
    };
};
